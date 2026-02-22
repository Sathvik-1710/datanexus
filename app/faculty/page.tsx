import { getFacultyMembers } from "@/lib/faculty";

export default function Faculty() {
  const members = getFacultyMembers();

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-16 text-center">
          Faculty Coordinators
        </h1>

        {members.length === 0 ? (
          <p className="text-center text-gray-500">Faculty info coming soon.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {members.map((member) => (
              <div
                key={member.slug}
                className={`bg-[#111111] border rounded-2xl p-6 hover:border-white transition duration-300 text-center ${
                  member.isHOD
                    ? "border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.05)]"
                    : "border-[#1F1F1F]"
                }`}
              >
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] mb-6 overflow-hidden flex items-center justify-center">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 text-xs">Photo</span>
                  )}
                </div>

                <h2 className="text-xl font-semibold mb-1">
                  {member.name || "TBA"}
                </h2>
                <p className="text-gray-400 text-sm">{member.designation}</p>
                {member.isHOD && (
                  <p className="text-gray-500 text-xs mt-1">Head of Department</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
