export default function SuccessPage({
  searchParams
}: {
  searchParams: { session_id?: string };
}) {
  return (
    <main style={{ padding: 24, maxWidth: 900 }}>
      <h1>Payment successful ✅</h1>
      <p style={{ opacity: 0.8 }}>
        Thanks for your purchase! We’ll follow up with fulfillment details.
      </p>

      {searchParams.session_id ? (
        <p style={{ fontFamily: "monospace", opacity: 0.7 }}>
          Session: {searchParams.session_id}
        </p>
      ) : null}

      <a href="/inventory" style={{ display: "inline-block", marginTop: 16 }}>
        Back to inventory
      </a>
    </main>
  );
}

