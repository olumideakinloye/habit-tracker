import { useMemo, useState } from "react";

const today = new Date().toISOString().split("T")[0];

export const useHabits = () => {
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");

    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("");

  const [activeTab, setActiveTab] = useState("All");

  // TOGGLE HABIT
  const toggleHabit = (id) => {
    const today = new Date().toISOString().split("T")[0];

    const updatedHabits = habits.map((habit) => {
      if (habit.id !== id) return habit;

      const alreadyDone = habit.completedDates.includes(today);

      return {
        ...habit,

        completedDates: alreadyDone
          ? habit.completedDates.filter((date) => date !== today)
          : [...habit.completedDates, today],
      };
    });

    // update state
    setHabits(updatedHabits);

    // save to localStorage
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  // DELETE HABIT
  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  // SAVE HABIT
  const saveHabit = (formData, editHabit) => {
    let updatedHabits;

    if (editHabit) {
      // EDIT
      updatedHabits = habits.map((habit) =>
        habit.id === editHabit.id
          ? {
              ...habit,
              ...formData,
            }
          : habit,
      );
    } else {
      // CREATE
      const newHabit = {
        id: Date.now(),
        ...formData,
        completedDates: [],
        createdAt: today,
      };

      updatedHabits = [...habits, newHabit];
    }

    // update state
    setHabits(updatedHabits);

    // save to localStorage
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
  };

  // FILTERED HABITS
  const filteredHabits = useMemo(() => {
    return habits
      .filter((habit) => {
        const doneToday = habit.completedDates.includes(today);

        if (activeTab === "Completed") {
          return doneToday;
        }

        if (activeTab === "Pending") {
          return !doneToday;
        }

        return true;
      })

      .filter((habit) =>
        activeCategory ? habit.category === activeCategory : true,
      )

      .filter((habit) =>
        search
          ? habit.title.toLowerCase().includes(search.toLowerCase())
          : true,
      );
  }, [habits, search, activeCategory, activeTab]);

  return {
    habits,
    filteredHabits,

    search,
    setSearch,

    activeCategory,
    setActiveCategory,

    activeTab,
    setActiveTab,

    toggleHabit,
    deleteHabit,
    saveHabit,
  };
};
