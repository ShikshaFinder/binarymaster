import "@/styles/globals.css";

export const metadata = {
  title: "BinaryMaster",
  description: "BinaryMaster - Your Trading Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">{children}</body>
    </html>
  );
}
