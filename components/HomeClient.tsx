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
      className={`inline-block transition-colors duration-500 ${isLocked ? "text-white" : "text-white/40"
        }`}
    >
      {display}
    </motion.span>
  );
}

const gradientText: React.CSSProperties = {
  background: "linear-gradient(170deg, #ffffff 0%, rgba(255,255,255,0.45) 100%)",
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
    gradient: "from-blue-500/20 to-violet-500/10",
    iconColor: "text-blue-300",
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
    gradient: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-300",
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
    gradient: "from-rose-500/20 to-orange-500/10",
    iconColor: "text-rose-300",
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
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden bg-black md:snap-start md:snap-always"
      >
        {/* Neural particle network */}
        <ParticleBackground />

        {/* Blue radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background:
              "radial-gradient(ellipse 75% 55% at 50% 50%, rgba(60,90,255,0.08) 0%, transparent 70%)",
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
            className="mb-8 px-5 py-2 rounded-full border border-white/15 bg-white/[0.06] text-[11px] text-gray-400 tracking-[0.25em] uppercase backdrop-blur-sm"
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
            className="mt-7 text-zinc-400 max-w-lg text-lg leading-relaxed"
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
              className="px-8 py-3.5 bg-white text-black rounded-full font-semibold text-sm hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300"
            >
              Explore Events
            </Link>
            <Link
              href="/team"
              className="px-8 py-3.5 border border-white/20 rounded-full text-sm font-medium hover:border-white/50 hover:bg-white/[0.07] transition-all duration-300"
            >
              Meet The Team
            </Link>
          </motion.div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 2 — IDENTITY
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 bg-black border-t border-white/[0.07] overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,50,150,0.07) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl w-full"
        >
          <div className="border border-white/10 rounded-3xl p-12 backdrop-blur-xl bg-white/[0.02] text-center space-y-5">
            <motion.div
              initial={{ scale: 0.65, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center mb-8"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_40px_rgba(255,255,255,0.08)]">
                <Image
                  src="/favicon.png"
                  alt="Data Nexus Logo"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </motion.div>

            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Established under</p>
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-4xl font-semibold text-white"
            >
              Department of Data Science
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              className="text-zinc-400 text-lg"
            >
              Joginpally B.R. Engineering College
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 }}
              className="text-zinc-600 text-xs tracking-widest pt-2"
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
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-black overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 55% at 50% 50%, rgba(30,60,90,0.06) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border border-white/10 rounded-[2.5rem] p-10 md:p-12 backdrop-blur-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/70">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">Our Vision</h2>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed">
              To build a community of disciplined, skilled, and future-ready technologists who solve real-world problems through data-driven thinking, secure systems, and strong engineering practices.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="group relative border border-white/10 rounded-[2.5rem] p-10 md:p-12 backdrop-blur-xl bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 overflow-hidden"
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
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white/70">
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
              <h2 className="text-2xl md:text-3xl font-bold">Our Mission</h2>
            </div>
            <ul className="space-y-4">
              {[
                "Foster data-driven thinking for informed decision-making",
                "Promote secure and reliable system design",
                "Strengthen core engineering practices and teamwork",
              ].map((point, idx) => (
                <li key={idx} className="flex gap-4 items-start">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                  <span className="text-zinc-400 leading-snug">{point}</span>
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
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 bg-black border-t border-white/[0.07] overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(20,100,60,0.05) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-5xl mx-auto w-full space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-3"
          >
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">By the numbers</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Our Impact</h2>
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
                <p className="text-5xl md:text-6xl font-bold tabular-nums tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
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
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-black border-t border-white/[0.07] overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 30%, rgba(80,30,120,0.06) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">What we do</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Our Focus</h2>
            <p className="text-zinc-500 max-w-xl mx-auto text-lg">
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
                className={`group relative border border-white/10 rounded-3xl p-10 backdrop-blur-xl bg-gradient-to-br ${item.gradient} hover:border-white/25 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(255,255,255,0.04), transparent 60%)" }} />
                <div className={`${item.iconColor} mb-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>
                <div className="mt-8 h-[1px] bg-gradient-to-r from-white/0 via-white/25 to-white/0 w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 5 — FACULTY
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] md:min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-black border-t border-white/[0.07] overflow-hidden md:snap-start md:snap-always"
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,60,90,0.06) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Under the guidance of</p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Faculty Coordinators</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
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
                  className={`relative border rounded-3xl p-8 backdrop-blur-xl text-center transition-all duration-300 ${member.isHOD
                    ? "border-white/25 bg-white/[0.06] shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                    }`}
                >
                  {member.isHOD && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-semibold uppercase tracking-widest rounded-full">
                        HOD
                      </span>
                    </div>
                  )}
                  <div className="relative w-28 h-28 mx-auto rounded-full bg-white/10 mb-6 overflow-hidden flex items-center justify-center border border-white/10">
                    {member.photo ? (
                      <Image src={member.photo} alt={member.name} fill className="object-cover" sizes="112px" />
                    ) : (
                      <span className="text-3xl font-bold text-white/20">
                        {member.name ? member.name[0].toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{member.name || "TBA"}</h3>
                  <p className="text-zinc-400 text-sm mt-2">{member.designation}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section >

      {/* ══════════════════════════════════════
          SECTION 6 — FOOTER
      ══════════════════════════════════════ */}
      <section className="md:snap-start md:snap-always" >
        <Footer />
      </section >
    </div >
  );
}