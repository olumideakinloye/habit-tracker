import calculateStreak from "./calculateStreak";
import completedTodayStreak from "./completedTodayStreak";

export const stats = (habits) => {
  return {
    totalHabits: habits.length,

    completedToday: habits.filter((habit) => completedTodayStreak(habit) === true).length,

    missedHabits: habits.filter((habit) => completedTodayStreak(habit) === false).length,

    currentStreak: Math.max(
      ...habits.map((habit) => calculateStreak(habit.completedDates)),
      0,
    ),
  };
};
