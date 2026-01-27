"use client";

import { useEffect, useMemo, useState } from "react";
import { client } from "../../lib/amplifyClient";
import { listInventoryItems } from "../../lib/gql";

type Item = {
  id: string;
  name: string;
  set?: string | null;
  priceCents: number;
  status: string;
  quantity: number;
};

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      const res = await client.graphql({
        query: listInventoryItems,
        variables: { filter: { status: { eq: "ACTIVE" } }, limit: 500 }
        // Uses API key for public reads if AppSync primary auth is API_KEY
      });

      const data = (res as any).data?.listInventoryItems?.items ?? [];
      setItems(data);
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => (x.name ?? "").toLowerCase().includes(s));
  }, [items, q]);

  return (
    <main style={{ padding: 24 }}>
      <h1>Inventory</h1>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input
          placeholder="Search cards…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 10, width: 340, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <a href="/" style={{ textDecoration: "none" }}>Home</a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 16
        }}
      >
        {filtered.map((item) => (
          <a
            key={item.id}
            href={`/item/${item.id}`}
            style={{
              border: "1px solid #eee",
              borderRadius: 14,
              padding: 14,
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.name}</div>
            <div style={{ opacity: 0.8 }}>{item.set ?? ""}</div>
            <div style={{ marginTop: 10, fontWeight: 600 }}>
              ${(item.priceCents / 100).toFixed(2)}
            </div>
            <div style={{ opacity: 0.7, marginTop: 6 }}>
              Qty: {item.quantity}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}

