import React from "react";
import { NavLink } from "react-router-dom";
import Stats from "../components/Stats";
import Habitcard from "../components/Cards/Habitcard";
import Sidebar from "../components/Sidebar";
import AddHabitBtn from "../components/AddHabitBtn";
import HabitForm from "../components/HabitForm";
import FocusSession from "../components/FocusSession";

import { useState, useEffect } from "react";
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

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);

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

  return (
    <div className="relative flex bg-black text-white w-full gap-6 md:gap-3 min-h-screen">
      <Sidebar />
      <div className="col px-4 pb-25 pt-6 md:pb-6 md:pr-6 w-full">
        <div className="flex justify-between items-start sm:items-center mb-5 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

            <p className="text-gray-400 mt-1 text-sm md:text-base">
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
        <Stats habits={filteredHabits} />

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
          {/* TODAY'S HABITS */}
          <div className="lg:col-span-2 bg-[#111111] border border-gray-900 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">Today's Habits</h2>
              <NavLink to={"/habits"} className="text-purple-400 hover:text-purple-300">
                View All
              </NavLink>
            </div>
            {filteredHabits.length > 0 ? (
              <div className="space-y-4">
                {filteredHabits.map((habit) => (
                  <Habitcard
                    key={habit.id}
                    habit={habit}
                    toggleHabit={toggleHabit}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 w-full">
                <p className="text-white">No habits for today.</p>
              </div>
            )}
          </div>

          {/* FOCUS SESSION CARD */}
          {filteredHabits &&
            <FocusSession
              habits={filteredHabits}
              selectedHabit={selectedHabit}
              setSelectedHabit={setSelectedHabit}
            />
          }
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
