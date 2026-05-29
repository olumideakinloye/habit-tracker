import React from "react";
import { Pencil, Trash2, Flame } from "lucide-react";
import {
  getStreak,
  getTotalLogs,
  getThisWeekCount,
  isHabitDoneToday,
} from "../utils/habitStats";

const categoryColors = {
  Fitness: "#f97316",
  Learning: "#06b6d4",
  Mindfulness: "#a855f7",
  Health: "#22c55e",
};

const HabitCard = ({ habit, toggleHabit, editHabit, deleteHabit }) => {
  const streak = getStreak(habit);

  const totalLogs = getTotalLogs(habit);

  const thisWeek = getThisWeekCount(habit);

  const isDoneToday = isHabitDoneToday(habit);

  const color = habit.color || categoryColors[habit.category] || "#64748b";
  return (
    <div
      className="
        bg-[#1a1a2e]
        border border-white/5
        rounded-3xl
        p-6
        transition-all duration-300
        hover:-translate-y-1
      "
      style={{
        boxShadow: `0 0 5px 1px ${color}`,
      }}
    >
      {/* TOP */}
      <div
        className="
        flex justify-between
        items-start
        mb-5
      "
      >
        <div className="flex gap-4">
          <div
            className="
              w-14 h-14
              rounded-2xl
              flex items-center justify-center
              text-2xl
            "
            style={{
              background: `${color}20`,
            }}
          >
            {habit.icon}
          </div>

          <div>
            <h2
              className="
              text-xl
              font-semibold
            "
            >
              {habit.title}
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => editHabit(habit)}
            className="
            text-gray-400
            hover:text-white
          "
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => deleteHabit(habit.id)}
            className="
              text-gray-400
              hover:text-red-400
            "
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* TAGS */}
      <div
        className="
        flex gap-2
        mb-6
      "
      >
        <span
          className="
          px-3 py-1
          rounded-xl
          text-xs
          bg-cyan-500/10
          text-cyan-300
        "
        >
          {habit.frequency}
        </span>

        <span
          className="
            px-3 py-1
            rounded-xl
            text-xs
          "
          style={{
            background: `${color}15`,
            color,
          }}
        >
          {habit.category.toLowerCase()}
        </span>
      </div>

      {/* STATS */}
      <div
        className="
        grid grid-cols-3
        gap-4
        mb-6
      "
      >
        <div>
          <p
            className="
            text-xs
            text-gray-500
            mb-2
          "
          >
            Streak
          </p>

          <div
            className="
            flex items-center
            gap-2
          "
          >
            <Flame size={16} className="text-orange-500" />

            <span
              className="
              text-xl
              font-bold
            "
            >
              {streak}d
            </span>
          </div>
        </div>

        <div>
          <p
            className="
            text-xs
            text-gray-500
            mb-2
          "
          >
            Total Logs
          </p>

          <h3
            className="
            text-xl
            font-bold
            text-cyan-400
          "
          >
            {totalLogs}
          </h3>
        </div>

        <div>
          <p
            className="
            text-xs
            text-gray-500
            mb-2
          "
          >
            This Week
          </p>

          <h3
            className="
            text-xl
            font-bold
          "
          >
            {thisWeek}
          </h3>
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={() => toggleHabit(habit.id)}
        className={`
          w-full
          py-4
          rounded-2xl
          font-semibold
          border
          transition-all duration-300

          ${
            isDoneToday
              ? `
                border-green-500/30
                bg-green-500/10
                text-green-400
              `
              : `
                border-orange-500/30
                text-orange-400
                hover:bg-orange-500/10
              `
          }
        `}
      >
        {isDoneToday ? "✓ Done Today" : "Mark Complete"}
      </button>
    </div>
  );
};

export default HabitCard;
