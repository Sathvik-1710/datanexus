import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import CursorGlow from "@/components/CursorGlow";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Data Nexus",
    template: "%s | Data Nexus",
  },
  description:
    "Official website of Data Nexus — the student-led tech club of the Department of Data Science, JBREC.",
  // app/icon.png is auto-detected by Next.js — no explicit icons config needed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-black text-white`}>
        {/* Global cursor glow */}
        <CursorGlow />
        <PageLoader>
          <Navbar />
          {children}
        </PageLoader>
      </body>
    </html>
  );
}