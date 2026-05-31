import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Settings,
} from "lucide-react";

const nav = [
  {
    title: "Dashboard",
    to: "/",
    bgColor: "bg-purple-600/20",
    hoverBg: "hover:bg-purple-600/20",
    textColor: "text-purple-400",
    groupHoverText: "group-hover:text-purple-400",
    icon: <LayoutDashboard size={22} />,
  },
  {
    title: "Habits",
    to: "/habits",
    bgColor: "bg-emerald-500/20",
    hoverBg: "hover:bg-emerald-500/20",
    textColor: "text-emerald-400",
    groupHoverText: "group-hover:text-emerald-400",
    icon: <CheckSquare size={22} />,
  },
  {
    title: "Calendar",
    to: "/calendar",
    bgColor: "bg-blue-500/20",
    hoverBg: "hover:bg-blue-500/20",
    textColor: "text-blue-400",
    groupHoverText: "group-hover:text-blue-400",
    icon: <CalendarDays size={22} />,
  },
  {
    title: "Settings",
    to: "/settings",
    bgColor: "bg-gray-600/20",
    hoverBg: "hover:bg-gray-600/20",
    textColor: "text-gray-400",
    groupHoverText: "group-hover:text-gray-400",
    icon: <Settings size={22} />,
  },
];

const Sidebar = () => {
  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex w-64 shrink-0 h-screen bg-[#111111] sticky top-0 left-0 pr-6 py-6 flex-col">
        <h1
          className="text-2xl font-bold ml-6 mb-10
            bg-gradient-to-r from-purple-400 to-pink-500
            bg-clip-text text-transparent
            drop-shadow-[0_0_15px_rgba(168,85,247,0.35)]"
        >
          HabitTrack
        </h1>

        <nav className="flex flex-col gap-4">
          {nav.map((item) => (
            <NavLink key={item.title} to={item.to} end={item.to === "/"}>
              {({ isActive }) => (
                <div
                  className={`
                    ${isActive
                      ? `text-white ${item.bgColor} translate-x-1`
                      : `text-gray-300 ${item.hoverBg} hover:text-white hover:translate-x-1`
                    }
                    flex items-center gap-3
                    p-3
                    rounded-r-full
                    transition-all duration-300 ease-in-out
                    group
                  `}
                >
                  <div
                    className={`transition-all duration-300
                      group-hover:scale-110
                      ${item.groupHoverText}
                      rounded-lg
                      ${isActive ? `scale-110 ${item.textColor}` : "text-gray-300"}`}
                  >
                    {item.icon}
                  </div>
                  <p className="font-medium tracking-wide">{item.title}</p>
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-gray-900 px-2 py-2 flex justify-around items-center">
        {nav.map((item) => (
          <NavLink key={item.title} to={item.to} end={item.to === "/"}>
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-200">
                <div
                  className={`p-2 rounded-xl transition-all duration-200
                    ${isActive
                      ? `${item.bgColor} ${item.textColor} scale-110`
                      : "text-gray-500"
                    }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-200
                    ${isActive ? item.textColor : "text-gray-600"}`}
                >
                  {item.title}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>

      {/* ── Mobile bottom padding spacer (so content doesn't hide behind tab bar) ── */}
      <div className="md:hidden h-20 w-full" />
    </>
  );
};

export default Sidebar;