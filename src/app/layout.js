// File: src/app/layout.js (atau app/layout.js)

import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/atom/navbar/navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Perpustakaan Digital",
  description: "Proyek perpustakaan dengan Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navbar />
        <main>{children}</main>{" "}
      </body>
    </html>
  );
}
