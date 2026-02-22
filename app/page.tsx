"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-black text-white">

      {/* ================= HERO ================= */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">

        <div className="absolute w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -z-10"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Data Nexus
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-zinc-400 max-w-2xl text-lg"
        >
          A student-led initiative driving innovation in Data Science,
          AI, and modern technology.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-10 flex gap-6"
        >
          <Link
            href="/events"
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition"
          >
            Explore Events
          </Link>

          <Link
            href="/team"
            className="px-6 py-3 border border-white/20 rounded-full hover:border-white transition"
          >
            Meet The Team
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 text-zinc-500 text-sm animate-pulse"
        >
          Scroll ↓
        </motion.div>
      </section>


      {/* ================= INSTITUTIONAL IDENTITY ================= */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">

          {/* Logo placeholders */}
          <div className="flex justify-center items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-xs text-zinc-500">JBREC</span>
            </div>

            <span className="text-zinc-500 text-xl">×</span>

            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-xs text-zinc-500">DN</span>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-semibold">
            Department of Data Science
          </h3>

          <p className="text-zinc-400">
            Joginpally B.R. Engineering College (UGC Autonomous)
          </p>

          <p className="text-zinc-500 text-sm">
            Yenkapally, Moinabad
          </p>

        </div>
      </section>


      {/* ================= FOCUS AREAS ================= */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-20">

          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Our Focus
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              We operate at the intersection of data, technology, and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">

            {[
              {
                title: "Data Science",
                desc: "Exploring data, machine learning, AI, and intelligent systems."
              },
              {
                title: "Web Development",
                desc: "Building modern, scalable and beautiful digital experiences."
              },
              {
                title: "Data Security",
                desc: "Understanding cybersecurity and protecting digital infrastructure."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="group border border-white/10 rounded-3xl p-10 backdrop-blur-xl bg-white/5 hover:border-white/30 transition"
              >
                <h3 className="text-2xl font-semibold mb-4">
                  {item.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
                <div className="mt-6 h-[1px] bg-white/20 w-0 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}

          </div>
        </div>
      </section>


      {/* ================= FACULTY COORDINATORS ================= */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-20">

          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Faculty Coordinators
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Guided and supported by the Department of Data Science.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">

            {/* HOD Card with subtle glow */}
            <div className="relative border border-white/20 rounded-3xl p-8 backdrop-blur-xl bg-white/5 text-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">

              <div className="w-28 h-28 mx-auto rounded-full bg-white/10 mb-6 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Photo</span>
              </div>

              <h3 className="text-xl font-semibold">
                DR. GAYATRI TANGIRALA
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                M.Tech, Ph.D
              </p>

              <p className="text-zinc-500 text-sm mt-1">
                HOD CSE (Data Science)
              </p>

            </div>

            {/* Associate Professor Placeholder */}
            <div className="border border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/5 text-center hover:border-white/30 transition">

              <div className="w-28 h-28 mx-auto rounded-full bg-white/10 mb-6 flex items-center justify-center">
                <span className="text-zinc-500 text-sm">Photo</span>
              </div>

              <h3 className="text-xl font-semibold">
                Faculty Name
              </h3>

              <p className="text-zinc-400 text-sm mt-2">
                Associate Professor
              </p>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
}