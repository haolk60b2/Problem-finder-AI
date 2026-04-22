import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Space_Grotesk } from "next/font/google";
import "@/app/globals.css";
import { TopNav } from "@/components/nav";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-body"
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Problem Finder AI",
  description: "Find real market problems before you build."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          displayFont.variable,
          bodyFont.variable,
          monoFont.variable,
          "font-body antialiased"
        ].join(" ")}
      >
        <TopNav />
        {children}
      </body>
    </html>
  );
}
