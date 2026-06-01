export default function AddHabitBtn({ onAdd }) {
  return (
    <div className="flex gap-3">
      <button
      onClick={onAdd}
        className="
                bg-purple-600
                hover:bg-purple-700
                px-3 py-2
                text-sm
                md:text-base
                md:px-5 md:py-3
                rounded-xl
                transition
              "
      >
        + Add Habit
      </button>
    </div>
  );
}
