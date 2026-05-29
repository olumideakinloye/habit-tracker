import React from "react";
import HabitCard from "./HabitCard";

const HabitGrid = ({
  habits,
  toggleHabit,
  deleteHabit,
}) => {
  return (
    <div className="
      grid grid-cols-1
      xl:grid-cols-2
      gap-5
    ">

      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          toggleHabit={toggleHabit}
          deleteHabit={deleteHabit}
        />
      ))}

    </div>
  );
};

export default HabitGrid;