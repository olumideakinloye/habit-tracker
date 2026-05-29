const today = new Date().toISOString().split("T")[0];

export const isHabitDoneToday = (habit) => {
  return habit.completedDates.includes(today);
};

export const getTotalLogs = (habit) => {
  return habit.completedDates.length;
};

export const getThisWeekCount = (habit) => {
  const now = new Date();

  const startOfWeek = new Date(now);

  startOfWeek.setDate(now.getDate() - now.getDay());

  return habit.completedDates.filter((date) => {
    return new Date(date) >= startOfWeek;
  }).length;
};

export const getStreak = (habit) => {
  const sortedDates = [...habit.completedDates].sort(
    (a, b) => new Date(b) - new Date(a),
  );

  if (!sortedDates.length) return 0;

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
};
