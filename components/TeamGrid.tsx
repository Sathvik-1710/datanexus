"use client";

import { motion } from "framer-motion";

type TeamMember = {
    slug: string;
    name: string;
    role: string;
    photo?: string;
};

export default function TeamGrid({ members }: { members: TeamMember[] }) {
    if (members.length === 0) {
        return (
            <p className="text-center text-gray-500 py-20">Team info coming soon.</p>
        );
    }

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {members.map((member, i) => (
                <motion.div
                    key={member.slug}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className="group bg-white/[0.03] border border-white/10 hover:border-white/30 hover:bg-white/[0.06] rounded-3xl p-8 transition-all duration-300"
                >
                    {/* Photo */}
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-white/10 mb-6 overflow-hidden flex items-center justify-center border border-white/5 group-hover:border-white/20 transition">
                        {member.photo ? (
                            <img
                                src={member.photo}
                                alt={member.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <span className="text-3xl font-bold text-white/20">
                                {member.name ? member.name[0].toUpperCase() : "?"}
                            </span>
                        )}
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-1">
                        <h2 className="text-lg font-semibold text-white">
                            {member.name || "TBA"}
                        </h2>
                        <p className="text-gray-400 text-sm">{member.role}</p>
                    </div>

                    {/* Hover underline */}
                    <div className="mt-6 h-[1px] bg-white/20 w-0 group-hover:w-full mx-auto transition-all duration-500" />
                </motion.div>
            ))}
        </div>
    );
}
