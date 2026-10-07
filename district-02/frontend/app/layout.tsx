import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "District 02 — Sales research", description: "AI-native B2B research workspace" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
