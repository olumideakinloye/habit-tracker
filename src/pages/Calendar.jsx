import React, { useMemo, useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Calendar, dateFnsLocalizer, Navigate, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { useHabits } from "../hooks/useHabits";
import { habitMeta } from "../data/habitMeta";
import { getStreak } from "../utils/habitStats";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CustomToolbar = ({ date, onNavigate }) => {
  const label = format(date, "MMMM yyyy");
  return (
    <div className="flex items-center justify-between mb-4 gap-3">
      <h2 className="text-base font-bold tracking-tight">{label}</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate(Navigate.TODAY)}
          className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:border-purple-500 hover:text-purple-400 active:scale-95 transition-all cursor-pointer"
        >
          Today
        </button>
        <button
          onClick={() => onNavigate(Navigate.PREVIOUS)}
          className="p-1.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:border-purple-500 hover:text-purple-400 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onNavigate(Navigate.NEXT)}
          className="p-1.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:border-purple-500 hover:text-purple-400 active:scale-95 transition-all cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

const Calendarpage = () => {
  const { habits } = useHabits();
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {
    const result = [];
    const today = new Date();
    const futureDays = 60;

    habits.forEach((habit) => {
      const color = habitMeta[habit.icon]?.color ?? "#a855f7";
      const createdAt = new Date(habit.createdAt);
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + futureDays);
      const cursor = new Date(createdAt);

      while (cursor <= endDate) {
        const dateStr = cursor.toISOString().split("T")[0];
        const isCompleted = habit.completedDates.includes(dateStr);
        const shouldShow =
          habit.frequency === "weekly"
            ? cursor.getDay() === createdAt.getDay()
            : true;

        if (shouldShow) {
          result.push({
            title: isCompleted ? `✓ ${habit.title}` : `○ ${habit.title}`,
            start: new Date(dateStr),
            end: new Date(dateStr),
            allDay: true,
            resource: { color: isCompleted ? color : color + "55", habit },
          });
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    });

    return result;
  }, [habits]);

  const eventPropGetter = (event) => ({
    style: {
      backgroundColor: event.resource.color,
      border: "none",
      borderRadius: "4px",
      fontSize: "0.6rem",
      fontWeight: "600",
      padding: "1px 3px",
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });

  return (
    <div className="relative flex flex-col md:flex-row bg-black text-white gap-6 md:gap-3 min-h-screen">
      <Sidebar />

      <div className="pt-6 px-4 w-full min-w-0 pb-24 md:pr-6 md:pb-7">

        {/* Page Header */}
        <div className="flex flex-col mb-5">
          <h1 className="text-2xl md:text-3xl font-bold">Calendar</h1>
          <p className="text-gray-400 mt-1 text-sm">Visualize your habit streaks over time</p>
        </div>

        {/* ── Streak Section ── */}
        <div className="bg-[#111111] border border-gray-900 rounded-3xl p-4 md:p-6 mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame size={18} className="text-orange-400" />
            <h2 className="text-sm font-bold text-white">Current Streaks</h2>
          </div>

          {habits.length === 0 ? (
            <p className="text-gray-600 text-sm">No habits yet — add some to track streaks.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {habits.map((habit) => {
                const streak = getStreak(habit);
                const color = habitMeta[habit.icon]?.color ?? "#a855f7";
                const isActive = streak > 0;

                return (
                  <div
                    key={habit.id}
                    className="flex flex-col gap-2 rounded-2xl p-3 border transition-all"
                    style={{
                      backgroundColor: isActive ? color + "12" : "#1a1a1a",
                      borderColor: isActive ? color + "40" : "#2a2a2a",
                    }}
                  >
                    {/* Icon + streak count */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{habit.icon}</span>
                      <div
                        className="flex items-center gap-1 text-xs font-bold rounded-lg px-2 py-0.5"
                        style={{
                          backgroundColor: isActive ? color + "25" : "#2a2a2a",
                          color: isActive ? color : "#4b5563",
                        }}
                      >
                        <Flame size={10} />
                        <span>{streak}</span>
                      </div>
                    </div>

                    {/* Habit title */}
                    <p
                      className="text-xs font-semibold leading-tight truncate"
                      style={{ color: isActive ? "#e5e7eb" : "#6b7280" }}
                    >
                      {habit.title}
                    </p>

                    {/* Streak label */}
                    <p className="text-[10px] text-gray-600">
                      {streak === 0
                        ? "No streak"
                        : streak === 1
                        ? "1 day streak"
                        : `${streak} day streak`}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Calendar Card ── */}
        <div className="bg-[#111111] border border-gray-900 rounded-3xl p-3 md:p-6">
          <style>{`
            .rbc-calendar { background: transparent !important; }
            .rbc-month-view {
              border: 1px solid #1f1f1f !important;
              border-radius: 12px;
              overflow: hidden;
              background: transparent !important;
            }
            .rbc-month-row { border-top: 1px solid #1f1f1f !important; }
            .rbc-day-bg { background: transparent !important; }
            .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #1f1f1f !important; }
            .rbc-off-range-bg { background: #0a0a0a !important; }
            .rbc-header {
              border-bottom: 1px solid #1f1f1f !important;
              padding: 6px 0;
              font-size: 0.6rem;
              font-weight: 600;
              color: #6b7280;
              letter-spacing: 0.04em;
              text-transform: uppercase;
              background: #111111 !important;
            }
            .rbc-header + .rbc-header { border-left: 1px solid #1f1f1f !important; }
            .rbc-date-cell { padding: 2px 4px; font-size: 0.65rem; color: #6b7280; }
            .rbc-date-cell.rbc-now a {
              background: #a855f7;
              color: #fff;
              border-radius: 50%;
              width: 18px;
              height: 18px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-weight: 700;
            }
            .rbc-date-cell a { color: #9ca3af; text-decoration: none; }
            .rbc-date-cell a:hover { color: #fff; }
            .rbc-today { background: rgba(168, 85, 247, 0.05) !important; }
            .rbc-event { box-shadow: none !important; outline: none !important; }
            .rbc-event:focus { outline: none !important; }
            .rbc-show-more { color: #a855f7 !important; font-size: 0.55rem; font-weight: 600; background: transparent; }
            .rbc-toolbar { display: none; }
            .rbc-row-content { background: transparent !important; }
            .rbc-month-header { background: transparent !important; }
            .rbc-row-segment { padding: 0 1px 1px; }
          `}</style>

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.MONTH]}
            view={Views.MONTH}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
            onView={() => {}}
            eventPropGetter={eventPropGetter}
            components={{ toolbar: CustomToolbar }}
            style={{ height: "70vh", color: "#fff", background: "transparent" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Calendarpage;