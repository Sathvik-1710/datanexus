import HomeHero from "@/components/HomeHero";
import { getFacultyMembers } from "@/lib/faculty";

export default function Home() {
  const facultyMembers = getFacultyMembers();

  return (
    <main className="bg-black text-white">

      <HomeHero />

      {/* ================= INSTITUTIONAL IDENTITY ================= */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">

          {/* Logo placeholders */}
          <div className="flex justify-center items-center gap-6">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-xs text-zinc-500">JBREC</span>
            </div>

            <span className="text-zinc-500 text-xl">×</span>

            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-xs text-zinc-500">DN</span>
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-semibold">
            Department of Data Science
          </h3>

          <p className="text-zinc-400">
            Joginpally B.R. Engineering College (UGC Autonomous)
          </p>

          <p className="text-zinc-500 text-sm">
            Yenkapally, Moinabad
          </p>

        </div>
      </section>

      {/* ================= FACULTY COORDINATORS ================= */}
      <section className="py-32 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-20">

          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Faculty Coordinators
            </h2>
            <p className="text-zinc-500 max-w-2xl mx-auto">
              Guided and supported by the Department of Data Science.
            </p>
          </div>

          {facultyMembers.length === 0 ? (
            <p className="text-center text-zinc-500">Faculty info coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-12">
              {facultyMembers.map((member) => (
                <div
                  key={member.slug}
                  className={`rounded-3xl p-8 backdrop-blur-xl bg-white/5 text-center transition ${
                    member.isHOD
                      ? "border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                      : "border border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="w-28 h-28 mx-auto rounded-full mb-6 overflow-hidden bg-white/10 flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-zinc-500 text-sm">Photo</span>
                    )}
                  </div>

                  {member.isHOD && (
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">
                      Head of Department
                    </p>
                  )}

                  <h3 className="text-xl font-semibold">
                    {member.name || "TBA"}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-2">
                    {member.designation}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
