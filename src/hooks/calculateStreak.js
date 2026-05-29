export default function calculateStreak (completedDates) {
  let streak = 0;

  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);

    checkDate.setDate(today.getDate() - i);

    const formatted = checkDate.toISOString().split("T")[0];

    if (completedDates.includes(formatted)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
