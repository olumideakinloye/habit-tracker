import React, { useState } from "react";
import Modal from "./ui/Modal";
import { ChevronDown } from "lucide-react";
import { habitMeta } from "../data/habitMeta";

export default function HabitForm({ habit, onSave, onClose }) {
  const [title, setTitle] = useState(habit?.title || "");

  const [icon, setIcon] = useState(habit?.icon || "⭐");

  const [frequency, setFrequency] = useState(habit?.frequency || "daily");

  const [reminder, setReminder] = useState(habit?.reminder || "08:00");

  const [reminderOn, setReminderOn] = useState(habit?.reminderOn ?? true);

  const selectedMeta = habitMeta[icon] || {
    category: "General",
    color: "#64748b",
  };

  const labelClasses = `
    block
    text-xs
    uppercase
    tracking-widest
    text-gray-400
    mb-2
  `;

  const inputClasses = `
    w-full
    rounded-2xl
    border
    border-white/10
    bg-white/5
    px-4
    py-3
    text-white
    outline-none
    transition-all
    focus:border-white/20
    focus:bg-white/10
  `;
  const dropClasses = `
    appearance-none
    bg-white/5
    outline-none
    border border-white/10
    rounded-2xl
    px-4 py-3
    text-white
    flex justify-between items-center
    text-white
    w-full
    transition-all
    focus:border-white/20
    focus:bg-white/10
  `;

   const down = `
    absolute
    right-4
    top-1/2
    translate-y-1/3
    pointer-events-none
    text-gray-400       
  `;
  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title,

      icon,

      category: selectedMeta.category,

      color: selectedMeta.color,

      frequency,

      reminder,

      reminderOn,
    }, habit);

    onClose();
  };

  return (
    <Modal title={habit ? "Edit Habit" : "Create Habit"} subtitle={"Build consistency one day at a time."} onClose={onClose}>
      <form className="space-y-6" onSubmit={handleSave}>
        {/* TITLE */}
        <div>
          <label className={labelClasses}>Habit Title</label>

          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Morning Run"
            className={inputClasses}
          />
        </div>

        {/* ICON SELECTION */}
        <div>
          <label className={labelClasses}>Habit Type</label>

          <div
            className="
              grid
              grid-cols-4
              gap-3
            "
          >
            {Object.entries(habitMeta).map(([emoji, meta]) => (
              <button
                type="button"
                key={emoji}
                onClick={() => setIcon(emoji)}
                className={`
                    rounded-2xl
                    border
                    p-3
                    transition-all
                    duration-200

                    ${
                      icon === emoji
                        ? `
                          scale-105
                          border-white/30
                          bg-white/10
                        `
                        : `
                          border-white/10
                          hover:bg-white/5
                        `
                    }
                  `}
              >
                <div className="text-2xl mb-2">{emoji}</div>

                <p
                  className="
                      text-xs
                      text-gray-400
                    "
                >
                  {meta.category}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* FREQUENCY */}
        <div className="relative w-full">
          <label className={labelClasses}>Frequency</label>

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className={`${dropClasses} text-black bg-white`}
          >
            <option className="text-black" value="daily">Daily</option>

            <option className="text-black" value="weekly">Weekly</option>
          </select>
          <ChevronDown
            size={18}
            className={down}
          />
        </div>

        {/* REMINDER */}
        <div>
          <label className={labelClasses}>Reminder</label>

          <div className="flex gap-3">
            <input
              type="time"
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
              className={inputClasses}
            />

            <button
              type="button"
              onClick={() => setReminderOn((prev) => !prev)}
              className={`
                px-5
                rounded-2xl
                font-bold
                transition-all

                ${
                  reminderOn
                    ? `
                      bg-emerald-400
                      text-black
                    `
                    : `
                      bg-white/10
                      text-gray-400
                    `
                }
              `}
            >
              {reminderOn ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-2xl
              border border-white/10
              py-4
              text-gray-300
              transition-all
              hover:bg-white/5
            "
          >
            Cancel
          </button>
          <input type="submit" 
            value={habit ? "Save Changes" : "Create Habit"}
            className="
              flex-1
              rounded-2xl
              py-4
              font-bold
              text-black
              transition-all
              hover:scale-[1.01]
              bg-[#FDE68A]
            "
            />

          {/* <button
            type="button"
            onSubmit={handleSave}
            className="
              flex-1
              rounded-2xl
              py-4
              font-bold
              text-black
              transition-all
              hover:scale-[1.01]
            "
            style={{
              background: selectedMeta.color,
            }}
          >
            {habit ? "Save Changes" : "Create Habit"}
          </button> */}
        </div>
      </form>
    </Modal>
  );
}
