import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import AddHabitBtn from "../components/AddHabitBtn";

import { useHabits } from "../hooks/useHabits";

const HabitsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
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
      <div
        className="col px-4 pt-6 pb-20 md:pr-6 md:pb-0 w-full relative flex flex-col min-h-full text-white"
      >
        {/* HEADER */}
        <div
          className="pb-3 flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Habits</h1>

            <p className="text-gray-400 mt-1 text-sm md:text-base">
              {filteredHabits.length} habits tracked
            </p>
          </div>
          {/* BUTTON */}
          <AddHabitBtn
            onAdd={() => {
              setEditHabit(null);
              setShowForm(true);
            }}
          />
        </div>

        {/* FILTER SECTION */}
        <div
          className="
        mb-3
        rounded-[28px]
        border border-white/5
        bg-white/3
        p-3
        backdrop-blur-2xl
      "
        >
          <FilterBar search={search} setSearch={setSearch} setCategoryFilter={setCategoryFilter} setFrequencyFilter={setFrequencyFilter} />
        </div>

        {/* HABITS GRID SECTION */}
        <div className="relative">
          {/* SOFT PANEL GLOW */}
          <div
            className="absolute inset-0 rounded-[40px] bg-linear-to-br from-violet-500/5 via-transparent to-cyan-500/5 blur-2xl"
          />

          <div className="relative z-10">
            {filteredHabits.length > 0 ? (
              <div
                className="
                  grid grid-cols-1
                  lg:grid-cols-2
                  lg:px-0
                  md:px-20
                  lg:gap-5 pb-5 gap-7"
              >
                {filteredHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    toggleHabit={toggleHabit}
                    deleteHabit={deleteHabit}
                    editHabit={(habit) => {
                      setEditHabit(habit);
                      setShowForm(true);
                    }}
                  />
                ))}
              </div>
            ) : (<div className="flex items-center justify-center h-48 w-full ">
              <p className="text-white">No habits found.</p>
            </div>)}
            {/* <HabitGrid
                habits={filteredHabits}
                toggleHabit={toggleHabit}
                deleteHabit={deleteHabit}
              /> */}
          </div>
        </div>
      </div>
      {/* Form Modal */}
      {showForm && (
        <HabitForm
          habit={editHabit}
          onSave={saveHabit}
          onClose={() => {
            setShowForm(false);
            setEditHabit(null);
          }}
        />
      )}
    </div>
  );
};

export default HabitsPage;
