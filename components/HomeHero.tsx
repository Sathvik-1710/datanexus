"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomeHero() {
  return (
    <>
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
    </>
  );
}
