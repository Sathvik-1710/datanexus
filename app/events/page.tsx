import EventCalendar from "@/components/EventCalendar";
import { getAllEvents } from "@/lib/events";
import Link from "next/link";

export default function Events() {
  const events = getAllEvents();
  const today = new Date();

  const pastEvents = events.filter(
    (event) => new Date(event.date) < today
  );

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-6xl mx-auto space-y-28">

        {/* Title */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold">
            Events
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore our upcoming sessions, workshops and previous events conducted by Data Nexus.
          </p>
        </section>

        {/* Calendar + Upcoming */}
        <EventCalendar events={events} />

        {/* Divider */}
        <div className="border-t border-[#1F1F1F]" />

        {/* Past Events Gallery */}
        <section className="space-y-16">
          <h2 className="text-3xl font-semibold">
            Past Events
          </h2>

          {pastEvents.length === 0 ? (
            <p className="text-gray-500">
              No past events yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-12">
              {pastEvents.map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`}>
                  <div className="group border border-[#1F1F1F] rounded-3xl overflow-hidden hover:border-white transition">

                    {/* Placeholder Image */}
                    <div className="h-60 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        Event Image
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-2">
                        {event.date}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}