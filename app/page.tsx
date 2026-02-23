import HomeClient from "@/components/HomeClient";
import { getAllEvents } from "@/lib/events";
import { getTeamMembers } from "@/lib/team";
import { getFacultyMembers } from "@/lib/faculty";
import { getSiteSettings } from "@/lib/settings";

// Always render fresh — reflects CMS changes without waiting for a redeploy
export const dynamic = "force-dynamic";

export default async function Home() {
  const [events, team, faculty, settings] = await Promise.all([
    getAllEvents(),
    getTeamMembers(),
    getFacultyMembers(),
    getSiteSettings()
  ]);

  const stats = [
    { label: "Events Hosted", value: events.length },
    { label: "Team Members", value: team.length },
    { label: "Faculty", value: faculty.length },
    { label: "Years Active", value: settings.years_active, suffix: "+" },
  ];

  return (
    <main>
      <HomeClient tagline={settings.tagline} stats={stats} faculty={faculty} />
    </main>
  );
}