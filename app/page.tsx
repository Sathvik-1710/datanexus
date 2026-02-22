import FacultySection from "@/components/FacultySection";
import HomeClient from "@/components/HomeClient";
import StatsSection from "@/components/StatsSection";
import { getAllEvents } from "@/lib/events";
import { getTeamMembers } from "@/lib/team";
import { getFacultyMembers } from "@/lib/faculty";

export default function Home() {
  // Compute stats server-side from CMS content
  const events = getAllEvents();
  const team = getTeamMembers();
  const faculty = getFacultyMembers();

  const stats = [
    { label: "Events", value: events.length },
    { label: "Team Members", value: team.length },
    { label: "Faculty", value: faculty.length },
    { label: "Years Active", value: 1, suffix: "+" },
  ];

  return (
    <main className="bg-black text-white">
      <HomeClient />
      <StatsSection stats={stats} />
      <FacultySection />
    </main>
  );
}