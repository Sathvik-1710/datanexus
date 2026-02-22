import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Data Nexus",
  description: "Official website of Data Nexus Club",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-black text-white`}>

        {/* Navbar */}
        <nav className="flex justify-between items-center px-8 py-6 border-b border-[#1F1F1F]">
          <h1 className="text-xl font-semibold tracking-wide">
            DATA NEXUS
          </h1>

          <div className="space-x-8 text-gray-400 text-sm">
            <a href="/" className="hover:text-white transition">
              Home
            </a>
            <a href="/team" className="hover:text-white transition">
              Team
            </a>
            <a href="/events" className="hover:text-white transition">
              Events
            </a>
          </div>
        </nav>

        {children}

      </body>
    </html>
  );
}