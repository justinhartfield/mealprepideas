import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://mealprepideas.co"),
  title: {
    template: "%s | MealPrepIdeas — Allergy-Friendly Anabolic Cookbook",
    default: "MealPrepIdeas — 130+ Allergy-Friendly Anabolic Recipes with Interactive P:E Charts",
  },
  description:
    "130+ high-protein, allergy-friendly recipes (GF, DF, SF, NF) with interactive P:E ratio charts, USDA nutrition facts, and real-time ingredient substitution. Built for bodybuilders with food allergies.",
  keywords: [
    "allergy-friendly recipes",
    "anabolic cookbook",
    "gluten-free high protein",
    "dairy-free bodybuilding",
    "P:E ratio",
    "meal prep",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MealPrepIdeas",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
