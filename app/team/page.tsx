import { getTeamMembers } from "@/lib/team";
import TeamGrid from "@/components/TeamGrid";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the leadership team of Data Nexus — the student-led tech club at JBREC.",
};

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <>
      <main className="min-h-screen bg-black text-white px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">People behind the club</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Our Leadership
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto">
              The passionate students driving Data Nexus forward — from organising events to building projects.
            </p>
          </div>

          {/* Animated grid */}
          <TeamGrid members={members} />

        </div>
      </main>
      <Footer />
    </>
  );
}