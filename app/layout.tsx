import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import PublicChrome from "@/components/PublicChrome";
import WaveBackground from "@/components/WaveBackground";
import ElectricCursor from "@/components/ElectricCursor";
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
    default: `${company.name} — Covering All Areas Within the M25 & Beyond`,
    template: `%s — ${company.name}`,
  },
  description:
    "NAPIT registered electricians covering all areas within the M25 and beyond. Domestic, commercial & industrial installation, testing, PAT testing and 24 hour emergency call-outs.",
  keywords: [
    "electrician London",
    "electrician within the M25",
    "commercial electrician",
    "domestic electrician",
    "PAT testing London",
    "EICR certificate",
    "emergency electrician",
  ],
};

export const viewport: Viewport = {
  themeColor: "#050505",
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
        <ElectricCursor />
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
