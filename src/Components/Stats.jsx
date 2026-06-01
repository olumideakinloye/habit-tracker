import React from "react";
import { stats } from "../hooks/habitStats";
import { useHabits } from "../hooks/useHabits";
import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  Target,
  CheckCircle2,
  CircleX,
} from "lucide-react";

export default function Stats({ habits }) {

  const { totalHabits, completedToday, missedHabits, currentStreak } = stats(habits);

  const statBlocks = [
    {
      title: "Total Habits",
      value: totalHabits,
      icon: <Target size={20} />,
      color: "text-blue-400",
      bgColor: "bg-blue-400/30",
    },

    {
      title: "Completed Today",
      value: completedToday,
      icon: <CheckCircle2 size={20} />,
      color: "text-green-400",
      bgColor: "bg-green-400/30"
    },

    {
      title: "Current Streak",
      value: currentStreak,
      icon: <Flame size={20} />,
      color: "text-orange-400",
      bgColor: "bg-orange-400/30"
    },

    {
      title: "Missed Habits",
      value: missedHabits,
      icon: <CircleX size={20} />,
      color: "text-red-400",
      bgColor: "bg-red-400/30"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {statBlocks.map((stat) => (
        <div key={stat.title}
          className="
        bg-[#171717]
        p-3
        rounded-2xl
        border border-white/5
        shadow-lg
        flex
        items-center
        justify-between
      "
        >
          <div>
            <h2 className="text-gray-400 text-sm">{stat.title}</h2>
            <p className="text-3xl flex font-bold mt-1 items-center justify-between">
              {stat.value}
            </p>
          </div>
          {stat.icon && <div className={`${stat.color} py-2 px-2 ${stat.bgColor} rounded-xl`}>{stat.icon}</div>}
        </div>))}

    </div>
  );
};

