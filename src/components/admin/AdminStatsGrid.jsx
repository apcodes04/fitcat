"use client";

import { FaUtensils, FaUserGroup, FaIndianRupeeSign, FaClock } from "react-icons/fa6";

export default function AdminStatsGrid({
  totalFoodItemsOrdered = 0,
  uniqueCustomersCount = 0,
  filteredTotalRevenue = 0,
  filteredPendingCount = 0,
  filteredOrdersCount = 0,
  dateLabel = "All Dates",
}) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* CARD 1: TOTAL PRE-ORDERED ITEMS */}
      <div className="relative overflow-hidden bg-[#171a17] p-5 rounded-xl border border-[#262a26] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#363b36] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#223a58] opacity-25 blur-xl pointer-events-none mix-blend-screen"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f]">
            TOTAL FOOD ITEMS
          </span>
          <FaUtensils className="text-[#05c92f] text-xs" />
        </div>
        <h3 className="text-3xl font-semibold text-[#faf9f5] tracking-[-0.03em] tabular-nums flex items-baseline gap-2">
          <span>{totalFoodItemsOrdered}</span>
          <span className="text-xs font-medium text-[#9a978f]">units</span>
        </h3>
        <p className="text-[11px] text-[#9a978f] mt-1.5 line-clamp-1">
          Across {filteredOrdersCount} pre-order tickets ({dateLabel})
        </p>
      </div>

      {/* CARD 2: UNIQUE CUSTOMERS */}
      <div className="relative overflow-hidden bg-[#171a17] p-5 rounded-xl border border-[#262a26] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#363b36] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#524a18] opacity-25 blur-xl pointer-events-none mix-blend-screen"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f]">
            UNIQUE CUSTOMERS
          </span>
          <FaUserGroup className="text-[#05c92f] text-xs" />
        </div>
        <h3 className="text-3xl font-semibold text-[#faf9f5] tracking-[-0.03em] tabular-nums flex items-baseline gap-2">
          <span>{uniqueCustomersCount}</span>
          <span className="text-xs font-medium text-[#9a978f]">people</span>
        </h3>
        <p className="text-[11px] text-[#9a978f] mt-1.5 line-clamp-1">
          Distinct customer pre-orders ({dateLabel})
        </p>
      </div>

      {/* CARD 3: PROJECTED REVENUE */}
      <div className="relative overflow-hidden bg-[#171a17] p-5 rounded-xl border border-[#262a26] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#363b36] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#5a261e] opacity-25 blur-xl pointer-events-none mix-blend-screen"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f]">
            PROJECTED REVENUE
          </span>
          <FaIndianRupeeSign className="text-[#05c92f] text-xs" />
        </div>
        <h3 className="text-3xl font-semibold text-[#05c92f] tracking-[-0.03em] tabular-nums">
          ₹{filteredTotalRevenue}
        </h3>
        <p className="text-[11px] text-[#9a978f] mt-1.5 line-clamp-1">
          Total revenue estimated ({dateLabel})
        </p>
      </div>

      {/* CARD 4: PENDING QUEUE */}
      <div className="relative overflow-hidden bg-[#171a17] p-5 rounded-xl border border-[#263629] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#363b36] hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.5)]">
        <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#552d41] opacity-25 blur-xl pointer-events-none mix-blend-screen"></div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f]">
            PENDING QUEUE
          </span>
          <FaClock className="text-yellow-400 text-xs animate-pulse" />
        </div>
        <h3 className="text-3xl font-semibold text-yellow-400 tracking-[-0.03em] tabular-nums">
          {filteredPendingCount}
        </h3>
        <p className="text-[11px] text-[#9a978f] mt-1.5 line-clamp-1">
          Orders awaiting pickup / confirmation
        </p>
      </div>
    </div>
  );
}
