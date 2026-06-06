import React from "react";
import { useState, useEffect } from "react";
import {
    Play,
    Pause,
    RotateCcw,
    Target,
} from "lucide-react";

export default function FocusSession({ habits, selectedHabit, setSelectedHabit }) {
    const [isRunning, setIsRunning] = useState(false);

    const [minutes, setMinutes] = useState(25);
    const [secs, setSecs] = useState(0);

    const [seconds, setSeconds] = useState(1500);

    const [initialTime, setInitialTime] = useState(1500);

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

    const radius = 120;

    const circumference =
        2 * Math.PI * radius;

    return (
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

            <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-6 w-full">Focus Session</h2>

                {/* TIMER */}
                <div className="flex relative items-center justify-center mb-3 lg:mb-8 w-full aspect-square lg:max-w-full max-w-100">
                    <svg
                        viewBox="0 0 300 300"
                        className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    -rotate-90
                  "
                    >
                        {/* Background Circle */}
                        <circle
                            cx="150"
                            cy="150"
                            r={radius}
                            stroke="#2a2a2a"
                            strokeWidth="12"
                            fill="none"
                        />

                        {/* Progress Circle */}
                        <circle
                            cx="150"
                            cy="150"
                            r={radius}
                            stroke="#a855f7"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={
                                circumference - (circumference * progress) / 100
                            }
                            className="
                      transition-all
                      duration-1000
                      drop-shadow-[0_0_5px_#a855f7]
                    "
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
              lg:mb-6
              w-full
            "
                >
                    <p className="text-gray-400 text-sm">Currently Focusing On</p>

                    <select
                        value={selectedHabit?.id || ""}
                        onChange={(e) => {
                            const habit = habits.find(
                                (h) => h.id === Number(e.target.value)
                            );
                            setSelectedHabit(habit);
                        }}
                        className="
    w-full
    mt-2
    bg-[#1a1a1a]
    border border-gray-800
    rounded-xl
    p-3
    text-white
    outline-none
  "
                    >
                        <option value="">Select a habit</option>

                        {habits.map((habit) => (
                            <option key={habit.id} value={habit.id}>
                                {habit.icon} {habit.title}
                            </option>
                        ))}
                    </select>
                </div>
                {/* TIMER INPUTS */}
                <div className="flex flex-col mt-7 lg:mt-10 mb-5 lg:mb-10 gap-3">
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
                                    setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))
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
                                    setSecs(Math.min(59, Math.max(0, Number(e.target.value))))
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
                <div className="flex justify-center gap-4">
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
    );
}
