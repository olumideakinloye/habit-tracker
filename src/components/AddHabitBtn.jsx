export default function AddHabitBtn({ onAdd }) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onAdd}
        className="
                bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-semibold 
                px-3 py-2
                text-sm
                md:text-base
                md:px-5 md:py-3
                rounded-xl
                transition-all              
                "
      >
        + Add Habit
      </button>
    </div>
  );
}
