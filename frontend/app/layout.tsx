import type { Metadata } from "next";
import "./globals.css";
import { AuctionProvider } from "@/lib/auction-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "BidZone – Bid Smart. Win More. | Enterprise Live Auction Marketplace",
  description: "The modern online auction marketplace with real-time live bidding, anti-sniping protection, and institutional escrow custody.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <AuctionProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
        </AuctionProvider>
      </body>
    </html>
  );
}
