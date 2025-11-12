import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/shared/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RICS Career Pathway Platform",
  description:
    "End-to-end RICS membership companion covering Student membership through Fellowship with AI guidance and Supabase-backed progress tracking.",
  metadataBase: new URL("https://rics-career-platform.example.com"),
  openGraph: {
    title: "RICS Career Pathway Platform",
    description:
      "Intelligent pathway advisor, competency management, CPD tracking, and assessment prep for the full RICS journey.",
    siteName: "RICS Career Pathways",
    images: [
      {
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        width: 1200,
        height: 630,
        alt: "RICS Career Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rics_career",
    title: "RICS Career Pathway Platform",
    description:
      "Guiding professionals from Student membership to FRICS with AI coaching and collaborative tooling."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
