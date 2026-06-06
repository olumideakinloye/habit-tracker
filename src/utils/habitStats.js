const today = new Date().toISOString().split("T")[0];

export const getStreak = (habit) => {
  if (!habit.completedDates.length) return 0;

  // DAILY HABITS
  if (habit.frequency === "daily") {
    const sortedDates = [...habit.completedDates].sort(
      (a, b) => new Date(b) - new Date(a)
    );

    let streak = 1;

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i + 1]);

      const diff = (current - next) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // WEEKLY HABITS
  const uniqueWeeks = new Set();

  habit.completedDates.forEach((dateString) => {
    const date = new Date(dateString);

    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    uniqueWeeks.add(startOfWeek.getTime());
  });

  const weeks = [...uniqueWeeks].sort((a, b) => b - a);

  let streak = 1;

  for (let i = 0; i < weeks.length - 1; i++) {
    const diff =
      (weeks[i] - weeks[i + 1]) / (1000 * 60 * 60 * 24 * 7);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

export const isHabitDoneToday = (habit) => {
  return habit.completedDates.includes(today);
};

export const getTotalLogs = (habit) => {
  return habit.completedDates.length;
};

export const isDateInCurrentWeek = (dateString) => {
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

export const isHabitCompleted = (habit) => {
  if (habit.frequency === "weekly") {
    return habit.completedDates.some(isDateInCurrentWeek);
  }

  return habit.completedDates.includes(today);
};

export const getThisWeekCount = (habit) => {
  return habit.completedDates.filter(isDateInCurrentWeek).length;
};