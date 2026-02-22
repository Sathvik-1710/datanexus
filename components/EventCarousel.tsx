"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventCarouselProps {
    images: string[];
    title: string;
}

function isValidImageUrl(url: string): boolean {
    if (!url) return false;
    if (url.startsWith("/")) return true;
    return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?.*)?$/i.test(url);
}

export default function EventCarousel({ images, title }: EventCarouselProps) {
    const validImages = images.filter(isValidImageUrl);
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

    const goTo = useCallback(
        (index: number, dir: number) => {
            setDirection(dir);
            setCurrent(index);
        },
        []
    );

    const prev = () => goTo((current - 1 + validImages.length) % validImages.length, -1);
    const next = useCallback(() => goTo((current + 1) % validImages.length, 1), [current, validImages.length, goTo]);

    // Auto-advance every 4 seconds if more than 1 image
    useEffect(() => {
        if (validImages.length <= 1) return;
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next, validImages.length]);

    if (validImages.length === 0) return null;

    // Single image — no carousel chrome needed
    if (validImages.length === 1) {
        return (
            <div className="w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                    src={validImages[0]}
                    alt={title}
                    className="w-full max-h-[520px] object-cover"
                />
            </div>
        );
    }

    const variants = {
        enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <div className="space-y-4">
            {/* Main slide area */}
            <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 aspect-[16/9] md:aspect-auto md:h-[480px]">
                <AnimatePresence custom={direction} mode="popLayout">
                    <motion.img
                        key={current}
                        src={validImages[current]}
                        alt={`${title} — image ${current + 1}`}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {/* Prev / Next buttons */}
                <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/80 transition backdrop-blur-sm"
                >
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <button
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/80 transition backdrop-blur-sm"
                >
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 right-5 z-10 text-xs text-white/60 tabular-nums">
                    {current + 1} / {validImages.length}
                </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center items-center gap-2">
                {validImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, i > current ? 1 : -1)}
                        aria-label={`Go to image ${i + 1}`}
                        className={`h-[3px] rounded-full transition-all duration-300 ${i === current ? "w-8 bg-white" : "w-3 bg-white/25 hover:bg-white/50"
                            }`}
                    />
                ))}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {validImages.map((src, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i, i > current ? 1 : -1)}
                        className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border transition-all duration-200 ${i === current ? "border-white/60 opacity-100" : "border-white/10 opacity-40 hover:opacity-70"
                            }`}
                    >
                        <img src={src} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
