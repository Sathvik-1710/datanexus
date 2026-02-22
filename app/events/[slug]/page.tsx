import EventCalendar from "@/components/EventCalendar";
import Link from "next/link";

export default function Events() {
  const events = [
    {
      title: "AI Bootcamp 2026",
      date: "2026-03-15",
      slug: "ai-bootcamp-2026",
    },
    {
      title: "Web Dev Workshop",
      date: "2026-04-02",
      slug: "web-dev-workshop",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-24">

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-center">
          Events
        </h1>

        {/* Calendar Section */}
        <EventCalendar events={events} />

        {/* Upcoming This Month */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold">
            Upcoming This Month
          </h2>

          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8">
            <p className="text-gray-400">
              Stay tuned for exciting sessions, workshops and club activities happening this month.
            </p>
          </div>
        </section>

        {/* Past Events Gallery */}
        <section className="space-y-10">
          <h2 className="text-3xl font-semibold">
            Past Events
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden hover:border-white transition"
              >
                <div className="h-60 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                  <span className="text-gray-600 text-sm">
                    Past Event Image
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold">
                    Event Title
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Brief recap of the event.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}