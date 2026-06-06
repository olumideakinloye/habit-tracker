import { useEffect, useMemo, useState } from "react";

const today = new Date().toISOString().split("T")[0];

const isDateInCurrentWeek = (dateString) => {
  const date = new Date(dateString);

  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return date >= startOfWeek && date <= endOfWeek;
};

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

        // DAILY HABITS
        if (habit.frequency === "daily") {
          const alreadyDoneToday =
            habit.completedDates.includes(today);

          return {
            ...habit,
            completedDates: alreadyDoneToday
              ? habit.completedDates.filter(
                (date) => date !== today
              )
              : [...habit.completedDates, today],
          };
        }

        // WEEKLY HABITS
        const completedThisWeek =
          habit.completedDates.some(isDateInCurrentWeek);

        return {
          ...habit,
          completedDates: completedThisWeek
            ? habit.completedDates.filter(
              (date) => !isDateInCurrentWeek(date)
            )
            : [...habit.completedDates, today],
        };
      })
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
