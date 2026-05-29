import React from "react";
import { NavLink } from "react-router-dom";
import Stats from "../Components/Stats";
import HabitCard from "../Components/Cards/Habitcard";
import Sidebar from "../Components/Sidebar";
import AddHabitBtn from "../Components/AddHabitBtn";
import HabitForm from "../components/HabitForm";

import { useState, useEffect } from "react";
import { useHabits } from "../hooks/useHabits";

import {
  getStreak,
  isHabitDoneToday,
} from "../utils/habitStats";

import {
  Flame,
  Play,
  Pause,
  RotateCcw,
  Target,
  CheckCircle2,
  CircleX,
} from "lucide-react";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const [isRunning, setIsRunning] = useState(false);

  const [minutes, setMinutes] = useState(25);
  const [secs, setSecs] = useState(0);

  const [seconds, setSeconds] = useState(1500);

  const [initialTime, setInitialTime] = useState(1500);

  const {
    filteredHabits,
    search,
    setSearch,
    setCategoryFilter,
    setFrequencyFilter,
    toggleHabit,
    deleteHabit,
    saveHabit,
  } = useHabits();

  useEffect(() => {
    let interval;

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const displayMinutes = String(Math.floor(seconds / 60)).padStart(2, "0");

  const displaySeconds = String(seconds % 60).padStart(2, "0");

  const progress = (seconds / initialTime) * 100;

  const handleReset = () => {
    setSeconds(initialTime);
    setIsRunning(false);
  };

  const handleSetTimer = () => {
    const totalSeconds = minutes * 60 + secs;

    setSeconds(totalSeconds);

    setInitialTime(totalSeconds);

    setIsRunning(false);
  };

  return (
    <div className="relative flex bg-black text-white w-full gap-6 md:gap-3">
      <Sidebar />
      <div className="col pr-6 pt-5 md:pr-3 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <p className="text-gray-400 mt-1">
              Track your daily habits and progress
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <AddHabitBtn
            onAdd={() => {
              setEditHabit(null);
              setShowForm(true);
            }}
          />
        </div>

        {/* STATS */}
        <Stats />

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
          {/* TODAY'S HABITS */}
          <div className="xl:col-span-2 bg-[#111111] border border-gray-900 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">Today's Habits</h2>
              <NavLink to={"/habits"} className="text-purple-400 hover:text-purple-300">
                View All
              </NavLink>
            </div>
            {filteredHabits.length > 0 ? (
              <div className="space-y-4">
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    title={habit.title}
                    habit={habit}
                    streak={getStreak(habit)}
                    completed={isHabitDoneToday(habit)}
                    category={habit.category}
                    toggleHabit={toggleHabit}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 w-full bg-amber-400">
                <p className="text-white">No habits for today.</p>
              </div>
            )}
          </div>

          {/* FOCUS SESSION CARD */}
          <div
            className="
          relative
          overflow-hidden
          bg-[#111111]
          border border-gray-900
          rounded-3xl
          p-6
        "
          >
            {/* GLOW EFFECT */}
            <div
              className="
            absolute
            top-0
            right-0
            w-40
            h-40
            bg-purple-500/20
            blur-3xl
          "
            ></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6">Focus Session</h2>

              {/* TIMER */}
              <div className="flex relative items-center justify-center mb-8 w-full aspect-square">
                <svg className="absolute w-full h-full rotate-[-90deg]">
                  <circle
                    cx="140"
                    cy="140"
                    r="125"
                    stroke="#2a2a2a"
                    strokeWidth="12"
                    fill="none"
                  />

                  <circle
                    cx="140"
                    cy="140"
                    r="125"
                    stroke="#a855f7"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={785}
                    strokeDashoffset={785 - (785 * progress) / 100}
                    className="transition-all duration-1000 drop-shadow-[0_0_5px_#a855f7]"
                  />
                </svg>
                <div className="text-center">
                  <h1 className="text-5xl font-bold">
                    {displayMinutes}:{displaySeconds}{" "}
                  </h1>
                </div>
              </div>

              {/* CURRENT TASK */}
              <div
                className="
              bg-[#1a1a1a]
              border border-gray-800
              rounded-2xl
              p-4
              mb-6
            "
              >
                <p className="text-gray-400 text-sm">Currently Focusing On</p>

                <h3 className="font-semibold text-lg mt-1">📚 Read 20 Pages</h3>
              </div>
              {/* TIMER INPUTS */}
              <div className="flex flex-col mt-10 mb-10 gap-3">
                <button
                  onClick={handleSetTimer}
                  disabled={isRunning}
                  className={`
                    bg-purple-600
                    text-black
                    py-2
                    rounded-full
                    font-semibold
                    transition
                    ${isRunning ? "bg-purple-600 opacity-50 cursor-auto" : "opacity-100 cursor-pointer hover:bg-[#1b1b1b] hover:ring-4 hover:ring-purple-600/40 hover:text-purple-500 drop-shadow-[0_0_3px_#a855f7] active:scale-95"}
                  `}
                >
                  Set Timer
                </button>
                <div className="flex items-center justify-center gap-5">
                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-sm mb-2 uppercase tracking-wider">
                      Minutes
                    </p>

                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) =>
                        setMinutes(
                          Math.min(59, Math.max(0, Number(e.target.value))),
                        )
                      }
                      className="
                      w-full
                      bg-[#1b1b1b]
                      border border-[#2a2a2a]
                      rounded-3xl
                      text-center
                      text-4xl
                      pb-1
                      text-white
                      outline-none
                    "
                    />
                  </div>

                  <h1 className="text-5xl text-gray-600 mt-3">:</h1>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <p className="text-gray-500 text-sm mb-2 uppercase tracking-wider">
                      Seconds
                    </p>

                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={secs}
                      onChange={(e) =>
                        setSecs(
                          Math.min(59, Math.max(0, Number(e.target.value))),
                        )
                      }
                      className="
                      w-full
                      bg-[#1b1b1b]
                      flex justify-center
                      border border-[#2a2a2a]
                      rounded-3xl
                      text-center
                      text-4xl
                      text-white
                      outline-none
                      pb-1
                    "
                    />
                  </div>
                </div>
              </div>
              {/* TIMER CONTROLS */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setIsRunning(true)}
                  disabled={isRunning}
                  className={`
                  hover:bg-purple-600
                bg-[#1f1f1f]
                p-4
                rounded-2xl
                transition
                ${isRunning ? "bg-purple-600 opacity-50 cursor-auto" : "opacity-100 cursor-pointer active:scale-95"}
              `}
                >
                  <Play size={20} />
                </button>

                <button
                  onClick={() => setIsRunning(false)}
                  className={`
                bg-[#1f1f1f]
                hover:bg-purple-600
                p-4
                rounded-2xl
                border border-gray-800
                transition
                ${isRunning ? "opacity-100 cursor-pointer active:scale-95" : "bg-purple-600 opacity-50 cursor-auto"}
              `}
                >
                  <Pause size={20} />
                </button>

                <button
                  onClick={handleReset}
                  className="
                  pointer
                bg-[#1f1f1f]
                hover:bg-purple-600
                p-4
                rounded-2xl
                border border-gray-800
                active:scale-95
                transition
              "
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              {/* MODES */}
            </div>
          </div>
        </div>
      </div>
      {/* Form Modal */}
      {
        showForm && (
          <HabitForm
            habit={editHabit}
            onSave={saveHabit}
            onClose={() => {
              setShowForm(false);
              setEditHabit(null);
            }}
          />
        )
      }
    </div >
  );
};

export default Dashboard;
