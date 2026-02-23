import { getProjectBySlug } from "@/lib/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import EventCarousel from "@/components/EventCarousel";
import { Github, Linkedin, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);

    if (!project) return notFound();

    return (
        <>
            <main className="min-h-screen bg-black text-white px-6 py-24">
                <div className="max-w-4xl mx-auto space-y-12">

                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
                    >
                        ← Back to Showcase
                    </Link>

                    <section className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight">{project.title}</h1>

                        <div className="flex flex-wrap gap-4">
                            {project.github_url && (
                                <a href={project.github_url} target="_blank" className="flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition text-sm">
                                    <Github size={16} /> GitHub
                                </a>
                            )}
                            {project.linkedin_url && (
                                <a href={project.linkedin_url} target="_blank" className="flex items-center gap-2 px-5 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full hover:bg-blue-600/20 transition text-sm">
                                    <Linkedin size={16} /> LinkedIn
                                </a>
                            )}
                            {project.live_url && (
                                <a href={project.live_url} target="_blank" className="flex items-center gap-2 px-5 py-2 bg-green-600/10 border border-green-500/20 text-green-400 rounded-full hover:bg-green-600/20 transition text-sm">
                                    <ExternalLink size={16} /> Live Demo
                                </a>
                            )}
                        </div>
                    </section>

                    {project.images.length > 0 && (
                        <div className="rounded-3xl overflow-hidden border border-white/10">
                            <EventCarousel images={project.images} title={project.title} />
                        </div>
                    )}

                    <section className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl font-bold mb-6">About the Project</h2>
                        <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                            {project.description}
                        </p>
                    </section>

                </div>
            </main>
            <Footer />
        </>
    );
}
