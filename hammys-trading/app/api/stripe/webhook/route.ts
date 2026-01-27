import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "../../../../lib/amplifyClient";
import { createOrder, getInventoryItem, updateInventoryItem } from "../../../../lib/gql";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia"
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const itemId = session.metadata?.itemId;
    const qty = Number(session.metadata?.qty ?? 1);

    if (!itemId) return NextResponse.json({ received: true });

    // Create an Order record (admin-only model; webhook runs server-side)
    await client.graphql({
      query: createOrder,
      variables: {
        input: {
          stripeSessionId: session.id,
          email: session.customer_details?.email ?? undefined,
          lineItemsJson: JSON.stringify([{ itemId, qty }]),
          amountTotalCents: session.amount_total ?? 0,
          status: "PAID",
          createdAt: new Date().toISOString()
        }
      },
      authMode: "iam" // webhook should use IAM in production; see README
    });

    // Decrement inventory (MVP)
    const itemRes = await client.graphql({
      query: getInventoryItem,
      variables: { id: itemId }
    });
    const item = (itemRes as any).data?.getInventoryItem;
    if (item) {
      const newQty = Math.max(0, (item.quantity ?? 0) - qty);
      await client.graphql({
        query: updateInventoryItem,
        variables: {
          input: {
            id: itemId,
            quantity: newQty,
            status: newQty === 0 ? "SOLD_OUT" : item.status
          }
        },
        authMode: "iam"
      });
    }
  }

  return NextResponse.json({ received: true });
}

