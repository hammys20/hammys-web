"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "../../../lib/amplifyClient";
import { getInventoryItem } from "../../../lib/gql";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await client.graphql({
        query: getInventoryItem,
        variables: { id }
      });
      setItem((res as any).data?.getInventoryItem ?? null);
    })();
  }, [id]);

  async function buyNow() {
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, quantity: 1 })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      window.location.href = data.url;
    } finally {
      setBusy(false);
    }
  }

  if (!item) return <main style={{ padding: 24 }}>Loading…</main>;

  const disabled = item.status !== "ACTIVE" || (item.quantity ?? 0) <= 0;

  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <a href="/inventory" style={{ textDecoration: "none" }}>← Back to inventory</a>

      <h1 style={{ marginTop: 12 }}>{item.name}</h1>
      <p style={{ opacity: 0.8 }}>
        {item.set ?? ""} {item.year ? `• ${item.year}` : ""}
      </p>

      <div style={{ fontSize: 22, fontWeight: 700 }}>
        ${(item.priceCents / 100).toFixed(2)}
      </div>

      <div style={{ opacity: 0.75, marginTop: 8 }}>
        Qty: {item.quantity} • Status: {item.status}
      </div>

      <button
        onClick={buyNow}
        disabled={disabled || busy}
        style={{
          marginTop: 16,
          padding: "12px 16px",
          borderRadius: 12,
          border: "1px solid #ddd",
          cursor: disabled ? "not-allowed" : "pointer"
        }}
      >
        {busy ? "Starting checkout…" : "Buy now"}
      </button>
    </main>
  );
}

