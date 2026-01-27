import Providers from "./providers";

export const metadata = {
  title: "Hammy's Trading",
  description: "Trading card inventory and checkout"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

