"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarSwitch() {
    const pathname = usePathname();

    // Hide navbar on admin page
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return <Navbar />;
}
