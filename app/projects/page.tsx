import { getAllProjects } from "@/lib/projects";
import Link from "next/link";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Project Showcase",
    description: "Explore innovative projects, hacks, and solutions developed by the Data Nexus community.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    const projects = await getAllProjects();

    return (
        <>
            <main className="min-h-screen bg-black text-white px-6 py-24">
                <div className="max-w-6xl mx-auto space-y-20">

                    <section className="text-center space-y-6">
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
                            Project Showcase
                        </h1>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            A collection of innovative builds, hackathon winners, and technical experiments from our members.
                        </p>
                    </section>

                    {projects.length === 0 ? (
                        <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
                            <p className="text-gray-500 italic">The showcase is currently being curated. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {projects.map((project) => (
                                <Link key={project.id} href={`/projects/${project.slug}`}>
                                    <div className="group bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 transition duration-500 h-full flex flex-col">
                                        <div className="h-56 overflow-hidden relative">
                                            {project.images?.[0] ? (
                                                <img
                                                    src={project.images[0]}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-700">No Image</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end p-6">
                                                <span className="text-sm font-bold tracking-widest text-white uppercase">View Details →</span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col gap-4">
                                            <h3 className="text-xl font-bold group-hover:text-blue-400 transition">{project.title}</h3>
                                            <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </>
    );
}
