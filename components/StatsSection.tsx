"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Stat = { label: string; value: number; suffix?: string };

function CountUp({ target, duration = 1500 }: { target: number; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const start = performance.now();
                    const animate = (now: number) => {
                        const progress = Math.min((now - start) / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(animate);
                    };
                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return <span ref={ref}>{count}</span>;
}

export default function StatsSection({ stats }: { stats: Stat[] }) {
    return (
        <section className="py-24 px-6 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center space-y-2"
                        >
                            <p className="text-4xl md:text-5xl font-bold tabular-nums tracking-tight">
                                <CountUp target={stat.value} />
                                <span className="text-gray-400">{stat.suffix ?? "+"}</span>
                            </p>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
