"use client";

import { formatBookingDateText } from "@/lib/orders";
import { FaCalendarDays, FaFire, FaClock, FaListUl, FaCalendarCheck } from "react-icons/fa6";

export default function AdminDateFilterModule({
  orders = [],
  selectedDateFilter,
  setSelectedDateFilter,
  customDateValue,
  setCustomDateValue,
}) {
  // Dynamically compute relative ISO dates
  const now = new Date();
  const todayISO = now.toISOString().split("T")[0];
  const tomorrowISO = new Date(now.getTime() + 86400000).toISOString().split("T")[0];
  const dayAfterISO = new Date(now.getTime() + 86400000 * 2).toISOString().split("T")[0];

  const formattedToday = formatBookingDateText(todayISO);
  const formattedTomorrow = formatBookingDateText(tomorrowISO);
  const formattedDayAfter = formatBookingDateText(dayAfterISO);

  // Helper to count orders for a target formatted date string
  const countForDate = (targetDateFormatted) => {
    return orders.filter(
      (o) => formatBookingDateText(o.bookingDate) === targetDateFormatted
    ).length;
  };

  const tomorrowCount = countForDate(formattedTomorrow);
  const todayCount = countForDate(formattedToday);
  const dayAfterCount = countForDate(formattedDayAfter);

  return (
    <div className="relative overflow-hidden bg-[#171a17] border border-[#262a26] rounded-xl p-5 shadow-sm space-y-4 transition-all duration-200 hover:border-[#363b36]">
      {/* Decorative Ink Blot background accent */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#223a58] opacity-20 blur-2xl pointer-events-none mix-blend-screen"></div>

      {/* Module Eyebrow & Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262a26] pb-3">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f] block">
            PRE-ORDER DATE MODULE
          </span>
          <h3 className="text-base font-semibold text-[#faf9f5] flex items-center gap-2 mt-0.5">
            <FaCalendarDays className="text-[#05c92f] text-sm" />
            <span>Select Pickup & Booking Date</span>
          </h3>
        </div>

        {/* Current Active Date Badge */}
        <div className="self-start sm:self-auto bg-[#0e2413] border border-[#1b4224] text-[#05c92f] px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
          <span>
            Viewing:{" "}
            <strong className="text-[#faf9f5]">
              {selectedDateFilter === "ALL"
                ? "All Dates"
                : selectedDateFilter === "TOMORROW"
                ? `Tomorrow (${formattedTomorrow})`
                : selectedDateFilter === "TODAY"
                ? `Today (${formattedToday})`
                : selectedDateFilter === "DAY_AFTER"
                ? formattedDayAfter
                : formatBookingDateText(customDateValue) || "Custom Date"}
            </strong>
          </span>
        </div>
      </div>

      {/* Quick Selection Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* TOMORROW CHIP (DEFAULT PRE-ORDER DAY) */}
        <button
          onClick={() => setSelectedDateFilter("TOMORROW")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
            selectedDateFilter === "TOMORROW"
              ? "bg-[#05c92f] text-[#0f110f] border-transparent shadow-sm scale-[1.02]"
              : "bg-[#171a17] text-[#faf9f5] border-[#363b36] hover:bg-[#faf9f5] hover:text-[#0f110f] hover:border-transparent"
          }`}
        >
          <FaFire className={selectedDateFilter === "TOMORROW" ? "text-[#0f110f]" : "text-[#05c92f]"} />
          <span>Tomorrow ({formattedTomorrow.split(",")[0]})</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              selectedDateFilter === "TOMORROW"
                ? "bg-[#0f110f] text-[#05c92f]"
                : "bg-[#0a0c0a] text-[#05c92f] border border-[#262a26]"
            }`}
          >
            {tomorrowCount}
          </span>
        </button>

        {/* TODAY CHIP */}
        <button
          onClick={() => setSelectedDateFilter("TODAY")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
            selectedDateFilter === "TODAY"
              ? "bg-[#05c92f] text-[#0f110f] border-transparent shadow-sm scale-[1.02]"
              : "bg-[#171a17] text-[#faf9f5] border-[#363b36] hover:bg-[#faf9f5] hover:text-[#0f110f] hover:border-transparent"
          }`}
        >
          <FaClock className={selectedDateFilter === "TODAY" ? "text-[#0f110f]" : "text-[#9a978f]"} />
          <span>Today ({formattedToday.split(",")[0]})</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              selectedDateFilter === "TODAY"
                ? "bg-[#0f110f] text-[#05c92f]"
                : "bg-[#0a0c0a] text-[#faf9f5] border border-[#262a26]"
            }`}
          >
            {todayCount}
          </span>
        </button>

        {/* DAY AFTER TOMORROW CHIP */}
        <button
          onClick={() => setSelectedDateFilter("DAY_AFTER")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
            selectedDateFilter === "DAY_AFTER"
              ? "bg-[#05c92f] text-[#0f110f] border-transparent shadow-sm scale-[1.02]"
              : "bg-[#171a17] text-[#faf9f5] border-[#363b36] hover:bg-[#faf9f5] hover:text-[#0f110f] hover:border-transparent"
          }`}
        >
          <FaCalendarCheck className={selectedDateFilter === "DAY_AFTER" ? "text-[#0f110f]" : "text-[#9a978f]"} />
          <span>{formattedDayAfter.split(",")[0]}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              selectedDateFilter === "DAY_AFTER"
                ? "bg-[#0f110f] text-[#05c92f]"
                : "bg-[#0a0c0a] text-[#faf9f5] border border-[#262a26]"
            }`}
          >
            {dayAfterCount}
          </span>
        </button>

        {/* CUSTOM DATE PICKER */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
            selectedDateFilter === "CUSTOM"
              ? "bg-[#faf9f5] text-[#0f110f] border-transparent shadow-sm"
              : "bg-[#0a0c0a] text-[#faf9f5] border-[#262a26] hover:border-[#363b36]"
          }`}
        >
          <span className="text-[11px] text-[#9a978f] uppercase font-bold shrink-0">Specific Date:</span>
          <input
            type="date"
            value={customDateValue}
            onChange={(e) => {
              setCustomDateValue(e.target.value);
              setSelectedDateFilter("CUSTOM");
            }}
            className="bg-transparent text-xs font-semibold text-[#faf9f5] focus:outline-none cursor-pointer [color-scheme:dark]"
          />
        </div>

        {/* ALL PRE-ORDERS CHIP */}
        <button
          onClick={() => setSelectedDateFilter("ALL")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
            selectedDateFilter === "ALL"
              ? "bg-[#05c92f] text-[#0f110f] border-transparent shadow-sm scale-[1.02]"
              : "bg-[#171a17] text-[#9a978f] border-[#262a26] hover:bg-[#faf9f5] hover:text-[#0f110f] hover:border-transparent"
          }`}
        >
          <FaListUl className="text-xs" />
          <span>All Pre-Orders</span>
          <span className="bg-[#0a0c0a] text-[#faf9f5] px-2 py-0.5 rounded-full text-[10px] font-extrabold border border-[#262a26]">
            {orders.length}
          </span>
        </button>
      </div>
    </div>
  );
}
