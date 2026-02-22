import EventCalendar from "@/components/EventCalendar";
import { getAllEvents } from "@/lib/events";
import Link from "next/link";

function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function Events() {
  const events = getAllEvents();

  const today = normalizeDate(new Date());

  const eventsWithDate = events.map((event) => {
    const eventDate = normalizeDate(new Date(event.date));
    return { ...event, dateObj: eventDate };
  });

  const currentEvents = eventsWithDate.filter(
    (event) => event.dateObj.getTime() === today.getTime()
  );

  const upcomingEvents = eventsWithDate.filter(
    (event) => event.dateObj.getTime() > today.getTime()
  );

  const pastEvents = eventsWithDate.filter(
    (event) => event.dateObj.getTime() < today.getTime()
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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

        {/* Calendar */}
        <EventCalendar events={events} />

        {/* ================= CURRENT EVENTS ================= */}
        {currentEvents.length > 0 && (
          <section className="space-y-12">
            <h2 className="text-3xl font-semibold text-white">
              Happening Today
            </h2>

            <div className="grid md:grid-cols-3 gap-12">
              {currentEvents.map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`}>
                  <div className="group border border-white rounded-3xl overflow-hidden hover:shadow-lg transition cursor-pointer">

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
                      <p className="text-gray-400 text-sm mt-2">
                        {formatDate(event.dateObj)}
                      </p>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
                        {formatDate(event.dateObj)}
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
                        {formatDate(event.dateObj)}
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