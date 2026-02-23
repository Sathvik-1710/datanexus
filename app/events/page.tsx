import EventCalendar from "@/components/EventCalendar";
import { getAllEvents, categorizeEvents, formatDateDisplay } from "@/lib/events";
import Link from "next/link";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

// Keep formatDateDisplay in scope for upcoming/past event cards

export const metadata: Metadata = {
  title: "Events",
  description: "Explore upcoming sessions, workshops and past events conducted by Data Nexus.",
};

export const dynamic = "force-dynamic";

export default async function Events() {
  const events = await getAllEvents();
  const { upcoming: upcomingEvents, past: pastEvents } =
    categorizeEvents(events);

  return (
    <>
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

          {/* Calendar */}
          <EventCalendar events={events} />

          {/* ================= UPCOMING ================= */}
          <section className="space-y-12">
            <h2 className="text-3xl font-semibold">
              Upcoming Events
            </h2>

            {upcomingEvents.length === 0 ? (
              <p className="text-gray-500">
                No upcoming events.
              </p>
            ) : (
              <div className="grid md:grid-cols-3 gap-12">
                {upcomingEvents.map((event) => (
                  <Link key={event.slug} href={`/events/${event.slug}`}>
                    <div className="group border border-[#1F1F1F] rounded-3xl overflow-hidden hover:border-white transition cursor-pointer">

                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-60 w-full object-cover"
                        />
                      ) : (
                        <div className="h-60 bg-[#111111] flex items-center justify-center">
                          <span className="text-gray-600 text-sm">
                            Event Image
                          </span>
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-lg font-semibold">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2">
                          {formatDateDisplay(event.date)}
                        </p>
                      </div>

                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Divider */}
          <div className="border-t border-[#1F1F1F]" />

          {/* ================= PAST EVENTS ================= */}
          <section className="space-y-12">
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
                    <div className="group border border-[#1F1F1F] rounded-3xl overflow-hidden hover:border-white transition cursor-pointer">

                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-60 w-full object-cover"
                        />
                      ) : (
                        <div className="h-60 bg-[#111111] flex items-center justify-center">
                          <span className="text-gray-600 text-sm">
                            Event Image
                          </span>
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-lg font-semibold">
                          {event.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2">
                          {formatDateDisplay(event.date)}
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
      <Footer />
    </>
  );
}
