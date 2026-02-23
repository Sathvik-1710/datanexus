"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type TeamMember = {
    slug: string;
    name: string;
    role: string;
    photo?: string;
    bio?: string;
    linkedin?: string;
};

function LinkedInIcon() {
    return (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

export default function TeamGrid({ members }: { members: TeamMember[] }) {
    const [selected, setSelected] = useState<TeamMember | null>(null);

    if (members.length === 0) {
        return (
            <p className="text-center text-gray-500 py-20">Team info coming soon.</p>
        );
    }

    return (
        <>
            {/* ── CARD GRID ── */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                {members.map((member, i) => (
                    <motion.div
                        key={member.slug}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        onClick={() => setSelected(member)}
                        className="group bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/[0.06] rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer"
                    >
                        {/* Full-width photo */}
                        <div className="w-full h-64 bg-white/5 overflow-hidden relative">
                            {member.photo ? (
                                <Image
                                    src={member.photo}
                                    alt={member.name}
                                    fill
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                                    <span className="text-6xl font-bold text-white/10">
                                        {member.name ? member.name[0].toUpperCase() : "?"}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Card footer */}
                        <div className="p-6 space-y-1">
                            <h2 className="text-base font-semibold text-white">{member.name || "TBA"}</h2>
                            <p className="text-gray-400 text-sm">{member.role}</p>

                            {/* LinkedIn on card */}
                            {member.linkedin && (
                                <div className="pt-3">
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/10 transition text-xs text-gray-400 hover:text-[#0A66C2]"
                                        aria-label={`${member.name} on LinkedIn`}
                                    >
                                        <LinkedInIcon />
                                        <span>LinkedIn</span>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Bottom scan line on hover */}
                        <div className="h-[1px] bg-white/20 w-0 group-hover:w-full transition-all duration-500 -mt-1" />
                    </motion.div>
                ))}
            </div>

            {/* ── MODAL ── */}
            <AnimatePresence>
                {selected && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSelected(null)}
                            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                        />

                        {/* Modal card */}
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ type: "spring", stiffness: 320, damping: 28 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
                        >
                            <div className="pointer-events-auto w-full max-w-2xl bg-[#0d0d0d] border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
                                <div className="flex flex-col md:flex-row">

                                    {/* Photo panel */}
                                    <div className="md:w-56 flex-shrink-0 bg-white/5 relative h-64 md:h-auto">
                                        {selected.photo ? (
                                            <Image
                                                src={selected.photo}
                                                alt={selected.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-64 md:h-full flex items-center justify-center">
                                                <span className="text-7xl font-bold text-white/10">
                                                    {selected.name?.[0]?.toUpperCase() ?? "?"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-8 space-y-4 relative">
                                        {/* Close button */}
                                        <button
                                            onClick={() => setSelected(null)}
                                            aria-label="Close"
                                            className="absolute top-5 right-5 text-gray-500 hover:text-white transition text-xl leading-none"
                                        >
                                            ✕
                                        </button>

                                        {/* Name + LinkedIn */}
                                        <div className="flex items-center gap-3 pr-8">
                                            <h2 className="text-2xl font-bold tracking-wide uppercase">
                                                {selected.name}
                                            </h2>
                                            {selected.linkedin && (
                                                <a
                                                    href={selected.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#0A66C2] hover:opacity-80 transition flex-shrink-0"
                                                    aria-label="LinkedIn"
                                                >
                                                    <LinkedInIcon />
                                                </a>
                                            )}
                                        </div>

                                        {/* Role */}
                                        <p className="text-gray-400 text-sm">{selected.role}</p>

                                        {/* Bio */}
                                        {selected.bio ? (
                                            <p className="text-gray-300 text-sm leading-relaxed border-t border-white/10 pt-4">
                                                {selected.bio}
                                            </p>
                                        ) : (
                                            <p className="text-gray-600 text-sm border-t border-white/10 pt-4 italic">
                                                No bio added yet.
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
