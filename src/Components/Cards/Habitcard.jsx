import React from 'react'

const Habitcard = ({ Key, title, habit, streak, category, completed, toggleHabit }) => {
  return (
    <div
      className="
        bg-[#171717]
        border border-white/5
        rounded-2xl
        p-5
        flex items-center justify-between
        hover:border-purple-500/30
        transition-all duration-300
      "
    >

      {/* Left Side */}
      <div>

        <p className="text-lg font-semibold">
          {title}
        </p>

        <div className="flex gap-3 mt-2 text-sm text-gray-400">

          <span>
            🔥 {streak} day streak
          </span>

          <span>
            {category}
          </span>

        </div>

      </div>


      {/* Right Side */}
      <button
        onClick={() => toggleHabit(habit.id)}
        className={`
          px-4 py-2 rounded-xl font-medium transition
          ${completed
            ? "bg-green-500/20 text-green-400"
            : "bg-purple-500 text-white hover:bg-purple-600"
          }
        `}
      >
        {completed ? "Completed" : "Mark Done"}
      </button>

    </div>
  )
}

export default Habitcard