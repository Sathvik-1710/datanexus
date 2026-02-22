import { getFacultyMembers } from "@/lib/faculty";

export default function FacultySection() {
  const faculty = getFacultyMembers();

  return (
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

        {faculty.length === 0 ? (
          <p className="text-center text-zinc-500">Faculty info coming soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {faculty.map((member) => {
              const cardClass = member.isHOD
                ? "relative border border-white/20 rounded-3xl p-8 backdrop-blur-xl bg-white/5 text-center shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                : "border border-white/10 rounded-3xl p-8 backdrop-blur-xl bg-white/5 text-center hover:border-white/30 transition";

              return (
                <div key={member.slug} className={cardClass}>
                  <div className="w-28 h-28 mx-auto rounded-full bg-white/10 mb-6 overflow-hidden flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-zinc-500 text-sm">Photo</span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold">
                    {member.name || "TBA"}
                  </h3>

                  <p className="text-zinc-400 text-sm mt-2">
                    {member.designation}
                  </p>

                  {member.isHOD && (
                    <p className="text-zinc-500 text-sm mt-1">HOD</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}