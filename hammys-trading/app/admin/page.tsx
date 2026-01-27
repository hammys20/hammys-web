"use client";

import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { client } from "../../lib/amplifyClient";
import { listInventoryItems } from "../../lib/gql";

export default function AdminPage() {
  return (
    <Authenticator>
      {({ signOut }) => <AdminInner signOut={signOut} />}
    </Authenticator>
  );
}

function AdminInner({ signOut }: { signOut?: () => void }) {
  const [items, setItems] = useState<any[]>([]);

  async function refresh() {
    const res = await client.graphql({
      query: listInventoryItems,
      variables: { limit: 500 },
      authMode: "userPool"
    });
    setItems((res as any).data?.listInventoryItems?.items ?? []);
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Admin</h1>
        <button onClick={signOut} style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #ddd" }}>
          Sign out
        </button>
      </div>

      <p style={{ opacity: 0.8 }}>
        MVP admin view (read-only). Next step is add/edit forms + S3 photo upload.
      </p>

      <div style={{ marginTop: 16 }}>
        {items.map((x) => (
          <div key={x.id} style={{ borderBottom: "1px solid #eee", padding: "10px 0" }}>
            <b>{x.name}</b> — ${(x.priceCents / 100).toFixed(2)} — qty {x.quantity} — {x.status}
          </div>
        ))}
      </div>
    </main>
  );
}

