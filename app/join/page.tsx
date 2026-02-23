"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const YEARS = ["B.Tech 1st Year", "B.Tech 2nd Year", "B.Tech 3rd Year", "B.Tech 4th Year"];

const DEPARTMENTS = [
    "Computer Science (CSE)",
    "Data Science",
    "AI & ML",
    "ECE",
    "EEE",
    "Mechanical",
    "IT",
    "Other"
];

const SUB_GROUPS = [
    "Data Science",
    "Data Security",
    "Web Development"
];

export default function JoinPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        // Roll number validation: JBREC roll numbers generally contain '67' in the 3rd and 4th position
        // e.g., 21671A0501. Allow some flexibility but enforce the "67" code strictly.
        const rollNo = data.rollNo as string;
        if (!rollNo.match(/^[a-zA-Z0-9]{2}67[a-zA-Z0-9]{6}$/i)) {
            setErrorMessage("Invalid Roll Number. You must be a JBREC student (College Code: 67) to join.");
            setStatus("error");
            return;
        }

        try {
            // Send data to our internal API route
            const response = await fetch("/api/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || "Failed to submit form.");
            }

            setStatus("success");
        } catch (err: any) {
            setErrorMessage(err.message || "Something went wrong joining the club. Please try again later.");
            setStatus("error");
        }
    };

    return (
        <>
            <main className="min-h-screen bg-black text-white px-6 py-24 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="text-center space-y-4 mb-16">
                        <p className="text-xs text-blue-400 uppercase tracking-[0.3em] font-semibold">Join The Community</p>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Become a Member
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
                            Data Nexus is exclusive to students of Joginpally B.R. Engineering College. Fill out the application below to join one of our focused sub-groups and start building with us.
                        </p>
                    </div>

                    {status === "success" ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-12 text-center space-y-4 backdrop-blur-sm"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-400">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Application Received!</h2>
                            <p className="text-green-200/70">
                                Welcome to Data Nexus. We have saved your details securely and will be in touch with you shortly.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            onSubmit={handleSubmit}
                            className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 space-y-8 backdrop-blur-md"
                        >
                            {/* Personal Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                                        Full Name <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        required
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="rollNo" className="text-sm font-medium text-gray-300">
                                        Roll Number (JBREC) <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        required
                                        id="rollNo"
                                        name="rollNo"
                                        type="text"
                                        placeholder="e.g. 21671A0501"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition uppercase"
                                    />
                                </div>
                            </div>

                            {/* College Info */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="year" className="text-sm font-medium text-gray-300">
                                        Year of Study <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        required
                                        id="year"
                                        name="year"
                                        defaultValue=""
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none"
                                    >
                                        <option value="" disabled className="text-gray-500">Select your year</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="department" className="text-sm font-medium text-gray-300">
                                        Department <span className="text-red-400">*</span>
                                    </label>
                                    <select
                                        required
                                        id="department"
                                        name="department"
                                        defaultValue=""
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none"
                                    >
                                        <option value="" disabled>Select your department</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <hr className="border-white/10" />

                            {/* Club Info */}
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-300">
                                    Choose your dedicated sub-group <span className="text-red-400">*</span>
                                </label>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
                                    As part of Data Nexus, you will join an exclusive cohort focused on a specialized area of technology. Please select the track that most interests you.
                                </p>

                                <div className="grid md:grid-cols-3 gap-4 pt-2">
                                    {SUB_GROUPS.map(group => (
                                        <label
                                            key={group}
                                            className="relative flex cursor-pointer rounded-xl border border-white/10 bg-black/50 p-4 hover:bg-white/[0.04] transition has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/10"
                                        >
                                            <input
                                                required
                                                type="radio"
                                                name="subGroup"
                                                value={group}
                                                className="peer sr-only"
                                            />
                                            <div className="flex w-full items-center justify-between">
                                                <span className="text-sm font-medium text-gray-300 peer-checked:text-blue-400">
                                                    {group}
                                                </span>
                                                <div className="h-4 w-4 rounded-full border border-gray-600 peer-checked:border-[4px] peer-checked:border-blue-500"></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Error Message */}
                            {status === "error" && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start gap-3">
                                    <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="12" y1="8" x2="12" y2="12" />
                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {errorMessage}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                            >
                                {status === "loading" ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>

                        </motion.form>
                    )}

                </div>
            </main>
            <Footer />
        </>
    );
}
