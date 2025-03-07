"use client";

import { useState, useEffect } from "react";

export default function MonthProgress() {
  const [monthProgress, setMonthProgress] = useState(0);
  const [currentMonth, setCurrentMonth] = useState("");
  const [remainingDays, setRemainingDays] = useState(0);

  useEffect(() => {
    const currentDateObj = new Date();
    const month = currentDateObj.toLocaleString("default", { month: "long" });
    const year = currentDateObj.getFullYear();
    const totalDaysInMonth = new Date(year, currentDateObj.getMonth() + 1, 0).getDate();
    const daysPassed = currentDateObj.getDate();
    const progress = Math.round((daysPassed / totalDaysInMonth) * 100); // Percentage
    const daysLeft = totalDaysInMonth - daysPassed; // Remaining Days

    setCurrentMonth(month);
    setMonthProgress(progress);
    setRemainingDays(daysLeft);
  }, []);

  return (
    <div className="flex flex-col items-center w-[320px]  text-white rounded-lg  border-gray-700 shadow-md mt-6">
      
      <div className="relative w-full h-12 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Striped Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 opacity-30 animate-stripes"></div>
        {/* Progress Bar */}
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${monthProgress}%` }}
        ></div>
        {/* Text Inside Progress Bar */}
        <div className="relative z-10 text-white text-sm font-bold">
          {remainingDays} Days Left
        </div>
      </div>
      {/* Month Title */}
      <span className="text-sm font-medium text-gray-300 mb-2">{currentMonth}</span>

    </div>
  );
}
