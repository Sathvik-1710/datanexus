import { getEventBySlug, getAllEvents } from "@/lib/events";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const events = getAllEvents();
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = getEventBySlug(params.slug);

  if (!event) return notFound();

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date TBA";

  return (
    <main className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Title */}
        <section className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            {event.title}
          </h1>
          <p className="text-gray-400">
            {formattedDate}
          </p>
        </section>

        {/* Image */}
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full rounded-3xl object-cover"
          />
        )}

        {/* Description */}
        {event.description && (
          <section className="prose prose-invert max-w-none">
            <p>{event.description}</p>
          </section>
        )}

      </div>
    </main>
  );
}