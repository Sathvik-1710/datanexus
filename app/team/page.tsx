export default function Team() {
  const members = [
    "President",
    "Vice President",
    "Web Dev Head",
    "AI/ML Head",
    "Data Security Head",
    "Operations Head",
    "Marketing & PR Head",
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-16 text-center">
          Our Leadership
        </h1>

        <div className="grid md:grid-cols-3 gap-10">
          {members.map((role, index) => (
            <div
  key={index}
  className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 hover:border-white transition duration-300"
>
  <div className="w-full h-64 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl mb-6 flex items-center justify-center">
    <span className="text-gray-600 text-sm">Photo Placeholder</span>
  </div>

  <h2 className="text-xl font-semibold mb-1">{role}</h2>
  <p className="text-gray-400 text-sm">
    Data Nexus Team Member
  </p>
</div>
          ))}
        </div>
      </div>
    </main>
  );
}