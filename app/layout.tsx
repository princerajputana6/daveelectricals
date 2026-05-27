import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { CartProvider } from "@/components/CartProvider";
import { company } from "@/lib/content";
import { getSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${company.name} — Electrician Hounslow, Twickenham, Feltham & Cranford`,
    template: `%s — ${company.name}`,
  },
  description:
    "NAPIT registered electricians serving Hounslow, Twickenham, Feltham & Cranford. Domestic, commercial & industrial installation, testing, PAT testing and 24 hour emergency call-outs.",
  keywords: [
    "electrician Hounslow",
    "electrician Twickenham",
    "electrician Feltham",
    "electrician Cranford",
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
  const user = session ? { name: session.name, email: session.email } : null;
  return (
    <html lang="en-GB" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <CartProvider>
          <ScrollProgress />
          <Navbar user={user} />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
