"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/team", label: "Team" },
    { href: "/events", label: "Events" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-5 border-b border-white/10 backdrop-blur-xl bg-black/70">

            {/* Logo */}
            <Link
                href="/"
                className="text-xl font-semibold tracking-widest hover:opacity-80 transition"
                onClick={() => setOpen(false)}
            >
                DATA NEXUS
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex space-x-8 text-sm">
                {navLinks.map(({ href, label }) => {
                    const isActive =
                        href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`relative transition pb-1 ${isActive
                                    ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>

            {/* Mobile hamburger */}
            <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Toggle menu"
                className="md:hidden flex flex-col gap-[5px] p-1"
            >
                <span
                    className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""
                        }`}
                />
                <span
                    className={`block w-6 h-[1.5px] bg-white transition-all duration-300 ${open ? "opacity-0" : ""
                        }`}
                />
                <span
                    className={`block w-6 h-[1.5px] bg-white transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""
                        }`}
                />
            </button>

            {/* Mobile dropdown */}
            {open && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 flex flex-col px-8 py-6 space-y-6">
                    {navLinks.map(({ href, label }) => {
                        const isActive =
                            href === "/" ? pathname === "/" : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`text-lg transition ${isActive ? "text-white font-medium" : "text-gray-400"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
