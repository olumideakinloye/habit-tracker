import React from 'react';
import "../Calendar.css";
import Sidebar from "../Components/Sidebar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Morning Run",
    start: new Date(2026, 4, 14, 7, 0),
    end: new Date(2026, 4, 14, 8, 0),
  },
  {
    title: "Read 30 mins",
    start: new Date(2026, 4, 14, 20, 0),
    end: new Date(2026, 4, 14, 21, 0),
  },
];

const Calendarpage = () => {
  return (
    <div className="relative flex bg-black text-white gap-6 md:gap-3">
      <Sidebar />
      <div className="col pr-6 pt-5 md:pr-3 w-full">
        <div className="bg-[#111827] p-4 rounded-3xl h-[85vh]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          defaultView="month"
        />
      </div>
      </div>
    </div>
  )
}

export default Calendarpage