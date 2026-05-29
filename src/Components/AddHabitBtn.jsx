export default function AddHabitBtn({ onAdd }) {
  return (
    <div className="flex gap-3">
      <button
      onClick={onAdd}
        className="
                bg-purple-600
                hover:bg-purple-700
                px-5 py-3
                rounded-xl
                transition
              "
      >
        + Add Habit
      </button>

      {/* <button
                  className="
                bg-[#1f1f1f]
                hover:bg-[#2a2a2a]
                px-5 py-3
                rounded-xl
                border border-gray-800
                transition
              "
                >
                  Start Focus
                </button> */}
    </div>
  );
}
