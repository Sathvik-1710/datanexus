"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDateDisplay } from "@/lib/dateUtils";

type EventType = {
  title: string;
  date: string;
  slug: string;
  image?: string;
};

interface Props {
  events: EventType[];
}

export default function EventCalendar({ events }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(today);

  const eventsWithDate = useMemo(() => {
    return events.map((event) => {
      // Parse YYYY-MM-DD without timezone shifts
      const [y, m, d] = event.date.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      dateObj.setHours(0, 0, 0, 0);
      return { ...event, dateObj };
    });
  }, [events]);

  // 🔥 Upcoming = today + future
  const upcomingEvents = eventsWithDate.filter(
    (event) => event.dateObj >= today
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        d
      );
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }

    return days;
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const eventsOnSelected =
    selectedDate === null
      ? []
      : eventsWithDate.filter(
          (event) =>
            event.dateObj.getTime() === selectedDate.getTime()
        );

  return (
    <div className="grid md:grid-cols-2 gap-28">

      {/* CALENDAR */}
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            ‹
          </button>

          <h2 className="text-2xl font-semibold tracking-tight">
            {monthLabel}
          </h2>

          <button
            onClick={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
            className="text-gray-400 hover:text-white transition text-2xl"
          >
            ›
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 text-xs text-gray-500 mb-6">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={monthLabel}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-7 gap-y-6"
          >
            {calendarDays.map((date, index) => {
              if (!date) return <div key={index}></div>;

              const hasEvent = eventsWithDate.some(
                (event) =>
                  event.dateObj.getTime() === date.getTime()
              );

              const isSelected =
                selectedDate &&
                date.getTime() === selectedDate.getTime();

              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`
                      w-11 h-11 flex items-center justify-center transition
                      ${
                        isSelected
                          ? "bg-white text-black rounded-full shadow-lg"
                          : "group-hover:bg-white/10 rounded-full"
                      }
                    `}
                  >
                    {date.getDate()}
                  </div>

                  {hasEvent && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="space-y-12">

        <h3 className="text-2xl font-semibold">
          Upcoming Events
        </h3>

        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500">
            No upcoming events.
          </p>
        ) : (
          upcomingEvents.map((event) => {
            const formattedDate = formatDateDisplay(event.date);

            return (
              <Link key={event.slug} href={`/events/${event.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="border border-white/10 backdrop-blur-xl bg-white/5 rounded-2xl p-6 cursor-pointer"
                >
                  <h4 className="text-lg font-semibold">
                    {event.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-2">
                    {formattedDate}
                  </p>
                </motion.div>
              </Link>
            );
          })
        )}

        {selectedDate && (
          <div className="pt-10 border-t border-white/10">
            <h4 className="mb-4">
              Events on{" "}
              {formatDateDisplay(
                `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
              )}
            </h4>

            {eventsOnSelected.length === 0 ? (
              <p className="text-gray-500">
                No events on this date.
              </p>
            ) : (
              eventsOnSelected.map((event) => (
                <div
                  key={event.slug}
                  className="mb-3 p-4 border border-white/10 rounded-xl"
                >
                  {event.title}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}