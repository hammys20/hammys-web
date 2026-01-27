import { NextResponse } from "next/server";
import Stripe from "stripe";
import { client } from "../../../lib/amplifyClient";
import { getInventoryItem } from "../../../lib/gql";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia"
});

export async function POST(req: Request) {
  const { itemId, quantity } = await req.json();
  const qty = Math.max(1, Number(quantity ?? 1));

  // Server-trusted lookup (never trust client price)
  const itemRes = await client.graphql({
    query: getInventoryItem,
    variables: { id: String(itemId) }
  });
  const item = (itemRes as any).data?.getInventoryItem;

  if (!item || item.status !== "ACTIVE" || (item.quantity ?? 0) < qty) {
    return new NextResponse("Item unavailable", { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: qty,
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.priceCents
        }
      }
    ],
    success_url: `${process.env.PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.PUBLIC_BASE_URL}/item/${item.id}`,
    metadata: { itemId: item.id, qty: String(qty) }
  });

  return NextResponse.json({ url: session.url });
}

