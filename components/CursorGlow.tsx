"use client";

import { useEffect, useRef } from "react";

/**
 * A subtle radial glow that follows the cursor across all pages.
 * Pure CSS — no canvas, no performance overhead.
 */
export default function CursorGlow() {
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Disable resource-intensive cursor tracking on mobile/touch devices
        if (window.matchMedia("(max-width: 768px)").matches ||
            ("ontouchstart" in window) ||
            navigator.maxTouchPoints > 0) {
            return;
        }

        const el = glowRef.current;
        if (!el) return;

        let raf = 0;
        let tx = -400, ty = -400; // target
        let cx = -400, cy = -400; // current (lerped)

        const onMove = (e: MouseEvent) => {
            tx = e.clientX;
            ty = e.clientY;
        };

        const animate = () => {
            // Lerp toward target for a smooth follow
            cx += (tx - cx) * 0.08;
            cy += (ty - cy) * 0.08;
            el.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
            raf = requestAnimationFrame(animate);
        };

        window.addEventListener("mousemove", onMove);
        animate();

        return () => {
            window.removeEventListener("mousemove", onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div
            ref={glowRef}
            aria-hidden
            className="fixed top-0 left-0 z-0 pointer-events-none w-[600px] h-[600px] rounded-full"
            style={{
                background:
                    "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)",
                willChange: "transform",
            }}
        />
    );
}
