import { getFacultyMembers } from "@/lib/faculty";

export default function FacultySection() {
  const faculty = getFacultyMembers();

  return (
    <section className="py-32 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <p className="text-xs text-gray-500 uppercase tracking-[0.3em]">Under the guidance of</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Faculty Coordinators
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">
            Guided and supported by the Department of Data Science.
          </p>
        </div>

        {faculty.length === 0 ? (
          <p className="text-center text-zinc-500">Faculty info coming soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {faculty.map((member) => (
              <div
                key={member.slug}
                className={`relative border rounded-3xl p-8 backdrop-blur-xl text-center transition-all duration-300 ${member.isHOD
                    ? "border-white/25 bg-white/[0.06] shadow-[0_0_50px_rgba(255,255,255,0.05)]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                  }`}
              >
                {/* HOD badge */}
                {member.isHOD && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-white text-black text-[10px] font-semibold uppercase tracking-widest rounded-full">
                      HOD
                    </span>
                  </div>
                )}

                {/* Photo */}
                <div className="w-28 h-28 mx-auto rounded-full bg-white/10 mb-6 overflow-hidden flex items-center justify-center border border-white/10">
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

                <h3 className="text-xl font-semibold">{member.name || "TBA"}</h3>
                <p className="text-zinc-400 text-sm mt-2">{member.designation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}