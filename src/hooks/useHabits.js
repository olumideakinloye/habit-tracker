import { useEffect, useMemo, useState } from "react";

const today = new Date().toISOString().split("T")[0];

export const useHabits = () => {
  // HABITS STATE
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem("habits");

    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  // FILTER STATES
  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("");

  const [frequencyFilter, setFrequencyFilter] = useState("");

  const [activeTab, setActiveTab] = useState("All");

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // TOGGLE HABIT
  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) return habit;

        const alreadyDone = habit.completedDates.includes(today);

        return {
          ...habit,

          completedDates: alreadyDone
            ? habit.completedDates.filter((date) => date !== today)
            : [...habit.completedDates, today],
        };
      }),
    );
  };

  // DELETE HABIT
  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  // SAVE HABIT
  const saveHabit = (formData, editHabit) => {
    if (editHabit) {
      // EDIT

      setHabits((prev) =>
        prev.map((habit) =>
          habit.id === editHabit.id
            ? {
                ...habit,
                ...formData,
              }
            : habit,
        ),
      );
    } else {
      // CREATE

      const newHabit = {
        id: Date.now(),

        ...formData,

        completedDates: [],

        createdAt: today,
      };

      setHabits((prev) => [...prev, newHabit]);
    }
  };

  // FILTERED HABITS
  const filteredHabits = useMemo(() => {
    return (
      habits
        // TAB FILTER
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

        // CATEGORY FILTER
        .filter((habit) =>
          categoryFilter ? habit.category === categoryFilter : true,
        )

        // FREQUENCY FILTER
        .filter((habit) =>
          frequencyFilter ? habit.frequency === frequencyFilter : true,
        )

        // SEARCH FILTER
        .filter((habit) =>
          search
            ? habit.title.toLowerCase().includes(search.toLowerCase())
            : true,
        )
    );
  }, [habits, search, categoryFilter, frequencyFilter, activeTab]);

  return {
    habits,

    filteredHabits,

    // SEARCH
    search,
    setSearch,

    // CATEGORY
    categoryFilter,
    setCategoryFilter,

    // FREQUENCY
    frequencyFilter,
    setFrequencyFilter,

    // TABS
    activeTab,
    setActiveTab,

    // ACTIONS
    toggleHabit,
    deleteHabit,
    saveHabit,
  };
};
