import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

/** Body and UI copy. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/** Headings and display type — geometric, tight, confident. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aurellecabs.com"),
  title: {
    default: "Aurelle Cabs — One-Way & Outstation Taxi Across Tamil Nadu",
    template: "%s | Aurelle Cabs",
  },
  description:
    "Book one-way drop taxis and outstation cabs across all 38 districts of Tamil Nadu. Transparent per-km billing, verified chauffeurs and no hidden return charges.",
  keywords: [
    "one way taxi Tamil Nadu",
    "drop taxi Chennai",
    "outstation cabs Coimbatore",
    "Madurai drop taxi",
    "Aurelle Cabs",
  ],
  openGraph: {
    title: "Aurelle Cabs — One-Way & Outstation Taxi Across Tamil Nadu",
    description:
      "Transparent per-km one-way and outstation cab booking across all 38 Tamil Nadu districts. Pay only for the distance you travel.",
    type: "website",
    locale: "en_IN",
    siteName: "Aurelle Cabs",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#BF0123",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-surface text-ink`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
