import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "BIG AD BIRD SMS Blast" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-white">{children}</body>
    </html>
  );
}
