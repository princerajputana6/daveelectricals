import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import PublicChrome from "@/components/PublicChrome";
import WaveBackground from "@/components/WaveBackground";
import { CartProvider } from "@/components/CartProvider";
import { company } from "@/lib/content";
import { getSession, isAdminSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${company.name} — Professional Cleaning for Homes & Businesses`,
    template: `%s — ${company.name}`,
  },
  description:
    "Reliable domestic and commercial cleaning across London and all areas within the M25 & beyond. Regular, one-off, deep, end of tenancy, after builders and commercial cleaning.",
  keywords: [
    "cleaning services London",
    "end of tenancy cleaning",
    "deep cleaning London",
    "domestic cleaning",
    "commercial cleaning",
    "after builders cleaning",
    "office cleaning London",
  ],
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const user = session
    ? {
        name: session.name,
        email: session.email,
        isAdmin: isAdminSession(session),
      }
    : null;
  return (
    <html lang="en-GB" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <WaveBackground />
        <CartProvider>
          <PublicChrome>
            <ScrollProgress />
            <Navbar user={user} />
          </PublicChrome>
          <main>{children}</main>
          <PublicChrome>
            <Footer />
            <WhatsAppButton />
          </PublicChrome>
        </CartProvider>
      </body>
    </html>
  );
}
