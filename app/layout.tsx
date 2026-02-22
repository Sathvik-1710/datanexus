import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

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
      <body className="font-sans bg-black text-white">
        
        {/* Netlify Identity Script */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="beforeInteractive"
        />

        {/* Navbar */}
        <nav className="flex justify-between items-center px-8 py-6 border-b border-[#1F1F1F]">
          <h1 className="text-xl font-semibold tracking-wide">
            DATA NEXUS
          </h1>

          <div className="space-x-8 text-gray-400 text-sm">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <Link href="/team" className="hover:text-white transition">
              Team
            </Link>
            <Link href="/faculty" className="hover:text-white transition">
              Faculty
            </Link>
            <Link href="/events" className="hover:text-white transition">
              Events
            </Link>
          </div>
        </nav>

        {children}

      </body>
    </html>
  );
}