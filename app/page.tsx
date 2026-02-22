import FacultySection from "@/components/FacultySection";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <main className="bg-black text-white">
      <HomeClient />
      <FacultySection />
    </main>
  );
}