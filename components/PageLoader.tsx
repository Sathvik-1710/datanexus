"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Renders a full-screen loading overlay that triggers on every
 * client-side route change. Uses a stroke-draw animation of the "DN" logo.
 */
export default function PageLoader({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prevPath = useRef(pathname);
    const [visible, setVisible] = useState(false);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        let hideTimer: NodeJS.Timeout;
        let removeTimer: NodeJS.Timeout;

        if (pathname !== prevPath.current) {
            prevPath.current = pathname;

            // Fix cascading render warning by delaying paint-triggering state updates
            requestAnimationFrame(() => {
                setVisible(true);
                setAnimating(true);
            });

            // Hide after animation completes (must match SVG animation duration)
            hideTimer = setTimeout(() => {
                setAnimating(false);
            }, 900);

            removeTimer = setTimeout(() => {
                setVisible(false);
            }, 1100);
        }

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        };
    }, [pathname]);

    return (
        <>
            {visible && (
                <div
                    className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-200 ${animating ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <DNLogo />
                </div>
            )}
            {children}
        </>
    );
}

/**
 * The DN logo drawn with animated SVG strokes.
 * Each line segment of the "D" and "N" draws itself sequentially.
 */
function DNLogo() {
    return (
        <svg
            width="120"
            height="80"
            viewBox="0 0 120 80"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Data Nexus"
        >
            {/* ─── Letter D ─── */}

            {/* D: left vertical bar */}
            <line x1="10" y1="8" x2="10" y2="72"
                style={{
                    strokeDasharray: 64,
                    strokeDashoffset: 64,
                    animation: "draw 0.3s ease forwards",
                    animationDelay: "0ms",
                }}
            />

            {/* D: top horizontal serif */}
            <line x1="10" y1="8" x2="22" y2="8"
                style={{
                    strokeDasharray: 12,
                    strokeDashoffset: 12,
                    animation: "draw 0.15s ease forwards",
                    animationDelay: "280ms",
                }}
            />

            {/* D: outer arc (curved right side) */}
            <path d="M 22,8 Q 52,8 52,40 Q 52,72 22,72"
                style={{
                    strokeDasharray: 90,
                    strokeDashoffset: 90,
                    animation: "draw 0.45s ease forwards",
                    animationDelay: "420ms",
                }}
            />

            {/* D: bottom horizontal serif */}
            <line x1="22" y1="72" x2="10" y2="72"
                style={{
                    strokeDasharray: 12,
                    strokeDashoffset: 12,
                    animation: "draw 0.15s ease forwards",
                    animationDelay: "840ms",
                }}
            />

            {/* ─── Letter N ─── */}

            {/* N: left vertical */}
            <line x1="65" y1="8" x2="65" y2="72"
                style={{
                    strokeDasharray: 64,
                    strokeDashoffset: 64,
                    animation: "draw 0.3s ease forwards",
                    animationDelay: "520ms",
                }}
            />

            {/* N: diagonal */}
            <line x1="65" y1="8" x2="110" y2="72"
                style={{
                    strokeDasharray: 80,
                    strokeDashoffset: 80,
                    animation: "draw 0.35s ease forwards",
                    animationDelay: "700ms",
                }}
            />

            {/* N: right vertical */}
            <line x1="110" y1="8" x2="110" y2="72"
                style={{
                    strokeDasharray: 64,
                    strokeDashoffset: 64,
                    animation: "draw 0.3s ease forwards",
                    animationDelay: "880ms",
                }}
            />

            <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
        </svg>
    );
}
