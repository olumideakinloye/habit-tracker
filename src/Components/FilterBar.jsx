import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { habitMeta } from "../data/habitMeta";

export default function FilterBar({
  search,
  setSearch,
  habit,
}) {
  const [button, setButton] = useState(
    habit?.frequency || "daily"
  );
  const [category, setCategory] = useState(
    habit?.category || "General"
  );

  const dropClasses = `
    appearance-none
    bg-[#1a1a2e]
    border border-white/3
    outline-none
    rounded-2xl
    px-5 py-4
    flex justify-between items-center
    text-white
    min-w-[200px]
  `;
 
  const down = `
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    pointer-events-none
    text-gray-400       
  `;
  return (
    <div
      className="
        flex flex-col xl:flex-row
        gap-4
        justify-between
      "
    >
      {/* SEARCH */}
      <div
        className="
          flex items-center gap-3
          bg-[#1a1a2e]
          border border-white/5
          rounded-2xl
          px-4 py-4
          w-full xl:w-[320px]
        "
      >
        <Search
          size={18}
          className="text-gray-500"
        />

        <input
          type="text"
          placeholder="Search habits..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            bg-transparent
            outline-none
            w-full
            text-white
            placeholder:text-gray-500
          "
        />
      </div>

      <div className="flex gap-4">
        {/* FREQUENCY */}
        <div
          className="relative min-w-[200px]"
        >
          <select
            value={button}
            onChange={(e) =>
              setButton(e.target.value)
            }
            className={dropClasses}
          >
            <option value="daily">
              Daily
            </option>

            <option value="weekly">
              Weekly
            </option>
          </select>
             <ChevronDown
              size={18}
              className={down}
            />
         
        </div>

        {/* CATEGORY */}
        <div
          className="relative min-w-[200px]"
        >
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className={dropClasses}
            
          >
           {Object.entries(habitMeta).map(([emoji, meta]) => (
            <option
              key={emoji}
              value={meta.category}
            >
              {meta.category}
            </option>
          ))}
          
          </select>
          <ChevronDown
            size={18}
            className={down}
          />
         
        </div>
      </div>
    </div>
  );
}