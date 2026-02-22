"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const focusAreas = [
  {
    title: "Data Science & AI",
    desc: "Exploring data pipelines, machine learning, deep learning, and intelligent systems that shape the future.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5V12h-4V9.5A4 4 0 0 1 8 6a4 4 0 0 1 4-4z" />
        <path d="M8 12H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h3" />
        <path d="M16 12h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3" />
        <path d="M12 16v6" />
        <circle cx="12" cy="21" r="1" />
        <circle cx="5" cy="17" r="1" />
        <circle cx="19" cy="17" r="1" />
      </svg>
    ),
  },
  {
    title: "Web Development",
    desc: "Building modern, scalable, and beautiful digital experiences using the latest frameworks and tools.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Data Security",
    desc: "Understanding cybersecurity principles, ethical hacking, and protecting digital infrastructure.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
];

export default function HomeClient() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute w-[700px] h-[700px] bg-white/[0.03] rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] bg-white/[0.04] rounded-full blur-2xl -z-10 pointer-events-none top-32 right-20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 tracking-widest uppercase"
        >
          Department of Data Science · JBREC
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
        >
          Data Nexus
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-zinc-400 max-w-xl text-lg leading-relaxed"
        >
          A student-led initiative driving innovation in Data Science, AI, and modern technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 flex gap-4 flex-wrap justify-center"
        >
          <Link
            href="/events"
            className="px-7 py-3 bg-white text-black rounded-full font-medium hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-200"
          >
            Explore Events
          </Link>
          <Link
            href="/team"
            className="px-7 py-3 border border-white/20 rounded-full hover:border-white hover:bg-white/5 transition-all duration-200"
          >
            Meet The Team
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-zinc-600"
        >
          <div className="w-[1px] h-8 bg-gradient-to-b from-transparent to-zinc-600 animate-pulse" />
          <span className="text-xs tracking-widest uppercase">Scroll</span>
        </motion.div>
      </section>

      {/* ─── INSTITUTIONAL IDENTITY ─── */}
      <section className="py-20 px-6 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="border border-white/10 rounded-3xl p-10 backdrop-blur-xl bg-white/[0.02] text-center space-y-4">
            {/* DN monogram */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                <svg width="36" height="28" viewBox="0 0 120 80" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="10" y1="8" x2="10" y2="72" />
                  <line x1="10" y1="8" x2="22" y2="8" />
                  <path d="M 22,8 Q 52,8 52,40 Q 52,72 22,72" />
                  <line x1="22" y1="72" x2="10" y2="72" />
                  <line x1="65" y1="8" x2="65" y2="72" />
                  <line x1="65" y1="8" x2="110" y2="72" />
                  <line x1="110" y1="8" x2="110" y2="72" />
                </svg>
              </div>
            </div>

            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Established under</p>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              Department of Data Science
            </h3>
            <p className="text-zinc-400">
              Joginpally B.R. Engineering College
            </p>
            <p className="text-zinc-600 text-xs tracking-wide">UGC Autonomous · Yenkapally, Moinabad</p>
          </div>
        </motion.div>
      </section>

      {/* ─── FOCUS AREAS ─── */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">What we do</p>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">Our Focus</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">
              We operate at the intersection of data, technology, and innovation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {focusAreas.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.5 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className="group border border-white/10 rounded-3xl p-10 backdrop-blur-xl bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300"
              >
                {/* Icon */}
                <div className="text-white/60 group-hover:text-white transition mb-6">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>

                {/* Expanding bottom line on hover */}
                <div className="mt-8 h-[1px] bg-white/20 w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}