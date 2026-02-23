"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import ParticleBackground from "./ParticleBackground";
import Footer from "./Footer";
import type { FacultyMember } from "@/lib/faculty";

/* ─── Hacker Scramble Title Helper ─── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\\\/[]{}—=+*^?#";

function ScrambleTitle({ text }: { text: string }) {
  let globalIndex = 0;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="flex flex-wrap justify-center gap-x-[0.25em]">
        {text.split(" ").map((word, wi) => (
          <span key={wi} className="flex">
            {word.split("").map((char) => {
              const currentIdx = globalIndex++;
              return (
                <ScrambleLetter
                  key={currentIdx}
                  char={char}
                  index={currentIdx}
                />
              );
            })}
          </span>
        ))}
      </span>
    </>
  );
}

function ScrambleLetter({ char, index }: { char: string; index: number }) {
  const [display, setDisplay] = useState(char);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Slight delay before scramble starts
    const startTimeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)]);
      }, 40);
    }, index * 20 + 200);

    // Lock correct letter
    const lockTimeout = setTimeout(() => {
      clearInterval(interval);
      setDisplay(char);
      setIsLocked(true);
    }, 900 + index * 90);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(lockTimeout);
      clearInterval(interval);
    };
  }, [index, char]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.9,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={gradientText}
      className={`inline-block transition-colors duration-500 ${isLocked ? "text-slate-900" : "text-slate-300"
        }`}
    >
      {display}
    </motion.span>
  );
}

const gradientText: React.CSSProperties = {
  background: "linear-gradient(135deg, #0ea5e9 0%, #a855f7 40%, #f97316 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "inline-block",
};

/* ─── Types ─── */
type Stat = { label: string; value: number; suffix?: string };

/* ─── CountUp ─── */
function CountUp({ target, duration = 1400 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

/* ─── Focus Areas data ─── */
const focusAreas = [
  {
    title: "Data Science & AI",
    desc: "Exploring data pipelines, machine learning, deep learning, and intelligent systems that shape the future.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V12h-4V9.5A4 4 0 0 1 8 6a4 4 0 0 1 4-4z" />
        <path d="M8 12H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3" />
        <path d="M16 12h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3" />
        <path d="M12 16v6" />
        <circle cx="12" cy="21" r="1" />
        <circle cx="5" cy="17" r="1" />
        <circle cx="19" cy="17" r="1" />
      </svg>
    ),
    gradient: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-sky-400",
  },
  {
    title: "Web Development",
    desc: "Building modern, scalable, and beautiful digital experiences using the latest frameworks and tools.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" opacity="0.4" />
      </svg>
    ),
    gradient: "from-orange-500/20 to-amber-500/10",
    iconColor: "text-orange-400",
  },
  {
    title: "Data Security",
    desc: "Understanding cybersecurity principles, ethical hacking, and protecting digital infrastructure.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    gradient: "from-blue-500/20 to-orange-500/10",
    iconColor: "text-blue-300",
  },
];

/* ─── Main Component ─── */
export default function HomeClient({
  tagline,
  stats,
  faculty,
}: {
  tagline: string;
  stats: Stat[];
  faculty: FacultyMember[];
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    /* ── Apple-style outer scroll container ── */
    <div
      ref={containerRef}
      className="h-[100dvh] overflow-y-auto md:max-h-[100dvh] md:snap-y md:snap-mandatory scroll-smooth relative"
    >
      {/* ══════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-transparent md:snap-start md:snap-always"
      >
        {/* Neural particle network */}
        <ParticleBackground />

        {/* Blue radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "radial-gradient(ellipse 75% 55% at 50% 50%, rgba(14,165,233,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Hero content */}
        <div
          style={{ zIndex: 10 }}
          className="relative flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 px-5 py-2 rounded-full border border-orange-500/20 bg-orange-50 text-[11px] text-orange-600 font-bold tracking-[0.25em] uppercase backdrop-blur-sm"
          >
            Department of Data Science · JBREC
          </motion.div>

          {/* Main title — Hacker Scramble Reveal */}
          <h1 className="text-[clamp(3.5rem,12vw,9rem)] font-bold tracking-tight leading-none flex flex-wrap justify-center gap-x-[0.25em]" aria-label="Data Nexus">
            <ScrambleTitle text="Data Nexus" />
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 text-slate-600 max-w-lg text-lg leading-relaxed"
          >
            {tagline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="mt-11 flex gap-4 flex-wrap justify-center"
          >
            <Link
              href="/events"
              className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-semibold text-sm hover:scale-105 hover:shadow-[0_10px_40px_rgba(249,115,22,0.3)] hover:bg-orange-500 transition-all duration-300"
            >
              Explore Events
            </Link>
            <Link
              href="/team"
              className="px-8 py-3.5 border border-slate-300 rounded-full text-slate-700 text-sm font-medium hover:border-slate-400 hover:bg-slate-100 transition-all duration-300"
            >
              Meet The Team
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
          style={{ zIndex: 10, position: "absolute", bottom: "2.5rem" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-5 h-8 rounded-full border border-slate-300 flex items-start justify-center p-1">
            <motion.div
              className="w-1 h-2 rounded-full bg-slate-400"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-bold">Scroll</span>
        </motion.div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 2 — IDENTITY
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 bg-transparent overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl w-full"
        >
          <div className="border border-slate-200 rounded-3xl p-12 bg-white shadow-xl text-center space-y-5">
            <motion.div
              initial={{ scale: 0.65, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 relative rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-lg bg-slate-50">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 120 120"
                  fill="none"
                  aria-label="Data Nexus Globe"
                >
                  <defs>
                    <linearGradient id="idGrad1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                    <linearGradient id="idGrad2" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>

                  {/* Base Sphere */}
                  <circle cx="60" cy="60" r="24" stroke="url(#idGrad1)" strokeWidth="1.5" fill="#000" />

                  {/* Lat/Lng Wireframe lines */}
                  <path d="M 60 36 C 40 36 40 84 60 84 C 80 84 80 36 60 36" stroke="url(#idGrad2)" strokeWidth="1" strokeOpacity="0.8" />
                  <path d="M 36 60 C 36 40 84 40 84 60 C 84 80 36 80 36 60" stroke="url(#idGrad1)" strokeWidth="1" strokeOpacity="0.8" />

                  {/* Orbital Rings crossed */}
                  <ellipse cx="60" cy="60" rx="46" ry="16" stroke="url(#idGrad1)" strokeWidth="2.5" strokeLinecap="round" transform="rotate(25 60 60)" />
                  <ellipse cx="60" cy="60" rx="46" ry="16" stroke="url(#idGrad2)" strokeWidth="2.5" strokeLinecap="round" transform="rotate(-25 60 60)" />

                  {/* Atom Orbs */}
                  <circle cx="18" cy="40" r="4" fill="#0ea5e9" />
                  <circle cx="102" cy="80" r="4" fill="#f97316" />
                  <circle cx="60" cy="14" r="4" fill="#0ea5e9" />
                  <circle cx="60" cy="106" r="4" fill="#f97316" />
                </svg>
              </div>
            </motion.div>

            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Established under</p>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-bold text-slate-900"
            >
              Department of Data Science
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="text-slate-600 text-lg"
            >
              Joginpally B.R. Engineering College
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
              className="text-slate-500 text-xs tracking-widest pt-2 font-semibold"
            >
              UGC Autonomous · Yenkapally, Moinabad
            </motion.p>
          </div>
        </motion.div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 2.5 — VISION & MISSION
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-transparent overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(168,85,247,0.06) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border border-slate-200 rounded-[2.5rem] p-10 md:p-12 bg-white shadow-xl hover:shadow-2xl hover:border-sky-300 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Our Vision</h2>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              To build a community of disciplined, skilled, and future-ready technologists who solve real-world problems through data-driven thinking, secure systems, and strong engineering practices.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border border-slate-200 rounded-[2.5rem] p-10 md:p-12 bg-white shadow-xl hover:shadow-2xl hover:border-orange-300 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22v-5" />
                <path d="M9 7V2" />
                <path d="M15 7V2" />
                <path d="M12 13V7" />
                <path d="M12 7H9" />
                <path d="M12 7h3" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22v-5" />
                  <path d="M9 7V2" />
                  <path d="M15 7V2" />
                  <path d="M12 13V7" />
                  <path d="M12 7H9" />
                  <path d="M12 7h3" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Foster data-driven thinking for informed decision-making",
                "Promote secure and reliable system design",
                "Strengthen core engineering practices and teamwork",
              ].map((point, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-slate-600 leading-snug">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 3 — STATS
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 bg-transparent overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(14,165,233,0.08) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-3"
          >
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">By the numbers</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Our Impact</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center space-y-3"
              >
                <p className="text-5xl md:text-6xl font-bold tabular-nums tracking-tight bg-gradient-to-b from-blue-600 to-indigo-900 bg-clip-text text-transparent drop-shadow-sm">
                  <CountUp target={stat.value} />
                  <span>{stat.suffix ?? "+"}</span>
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 4 — FOCUS AREAS
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-transparent overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">What we do</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Our Focus</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-lg">
              We operate at the intersection of data, technology, and innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {focusAreas.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.14, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.03, y: -7 }}
                className={`group relative border border-slate-200 shadow-xl rounded-3xl p-10 bg-white hover:-translate-y-2 hover:shadow-2xl hover:border-sky-300 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(14,165,233,0.05), transparent 60%)" }} />
                <div className={`${item.iconColor} mb-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                <div className="mt-8 h-[1px] bg-gradient-to-r from-slate-200/0 via-slate-300 to-slate-200/0 w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 5 — FACULTY
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-transparent overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(14,165,233,0.06) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Under the guidance of</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">Faculty Coordinators</h2>
            <p className="text-slate-600 max-w-xl mx-auto">
              Guided and supported by the Department of Data Science.
            </p>
          </motion.div>

          {faculty.length === 0 ? (
            <p className="text-center text-zinc-500">Faculty info coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-10">
              {faculty.map((member, i) => (
                <motion.div
                  key={member.slug}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative border rounded-[2rem] p-8 text-center transition-all duration-300 ${member.isHOD
                    ? "border-sky-200 bg-sky-50 shadow-xl"
                    : "border-slate-200 bg-white shadow-md hover:shadow-xl hover:-translate-y-2 hover:border-slate-300"
                    }`}
                >
                  {member.isHOD && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-sky-500 text-white text-[10px] font-semibold uppercase tracking-widest rounded-full shadow-md">
                        HOD
                      </span>
                    </div>
                  )}
                  <div className="relative w-28 h-28 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden flex items-center justify-center border border-slate-200 shadow-sm">
                    {member.photo ? (
                      <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="112px" />
                    ) : (
                      <span className="text-3xl font-bold text-slate-300">
                        {member.name ? member.name[0].toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{member.name || "TBA"}</h3>
                  <p className="text-slate-600 text-sm mt-2">{member.designation}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 6 — FOOTER
      ══════════════════════════════════════ */}
      <section className="md:snap-start md:snap-always">
        <Footer />
      </section>
    </div >
  );
}