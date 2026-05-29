export default function completedTodayStreak(habit) {
  const today = new Date().toISOString().split("T")[0];

  const isDoneToday = habit.completedDates.includes(today);
  return isDoneToday;
}
