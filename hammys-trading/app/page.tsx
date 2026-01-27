export default function HomePage() {
  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1 style={{ marginBottom: 8 }}>Hammy&apos;s Trading</h1>
      <p style={{ opacity: 0.8 }}>
        Fresh singles, slabs, and drops. Shop inventory below.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <a href="/inventory" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 10 }}>
          View Inventory
        </a>
        <a href="/admin" style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 10 }}>
          Admin
        </a>
      </div>
    </main>
  );
}

