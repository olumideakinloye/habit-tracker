import React from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FilterBar from "../components/FilterBar";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import AddHabitBtn from "../Components/AddHabitBtn";

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
    <div className="relative flex bg-black text-white w-full gap-6 md:gap-3">
      <Sidebar />
      <div
        className="col pr-6 pt-5 md:pr-3 w-full relative flex flex-col min-h-full text-white"
      >
        {/* HEADER */}
        <div
          className="pb-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6"
        >
          <div>
            {/* TITLE */}
            <h1
              className="
            text-5xl
            font-black
            tracking-tight
            leading-none

            bg-linear-to-r
            from-white
            via-violet-200
            to-cyan-200

            bg-clip-text
            text-transparent
          "
            >
              My Habits
            </h1>

            {/* SUBTITLE */}
            <p
              className="
            mt-4
            text-base
            text-slate-400
          "
            >
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
                  xl:grid-cols-2
                  gap-5 pb-5"
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
