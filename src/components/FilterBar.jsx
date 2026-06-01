import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { habitMeta } from "../data/habitMeta";

export default function FilterBar({
  search,
  setSearch,
  setCategoryFilter,
  setFrequencyFilter,
  habit,
}) {
  const [button, setButton] = useState(
    habit?.frequency || "All"
  );
  const [category, setCategory] = useState(
    habit?.category || "All"
  );

  const dropClasses = `
    appearance-none
    bg-[#171717]
    border border-white/3
    outline-none
    rounded-2xl
    pl-3 pr-5
    md:px-5 md:py-4
    py-2
    flex justify-between items-center
    text-white
    w-[150px]
    md:min-w-[200px]
  `;

  const down = `
    absolute
    right-2
    md:right-4
    top-0
    bottom-0
    m-auto
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
          bg-[#171717]
          border border-white/5
          rounded-2xl
          px-4 py-2 md:py-4
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
          className="relative min-w-37.5 md:min-w-50"
        >
          <select
            value={button}
            onChange={(e) => {
              setButton(e.target.value);
              if (e.target.value !== "All") {
                setFrequencyFilter(e.target.value)
              } else {
                setFrequencyFilter("");
              }
            }
            }
            className={dropClasses}
          >
            <option value="All">
              All Frequencies
            </option>

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
          className="relative min-w-37.5 md:min-w-50"
        >
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value !== "All") {
                setCategoryFilter(e.target.value)
              } else {
                setCategoryFilter("");
              }
            }
            }
            className={dropClasses}

          >
            <option value="All">
              All Categories
            </option>
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