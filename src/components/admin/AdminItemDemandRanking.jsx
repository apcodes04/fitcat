"use client";

import { FaUtensils } from "react-icons/fa6";

export default function AdminItemDemandRanking({ rankedItemDemand = [], dateLabel = "Selected Period" }) {
  if (!rankedItemDemand || rankedItemDemand.length === 0) return null;

  return (
    <div className="relative overflow-hidden bg-[#171a17] p-6 rounded-xl border border-[#262a26] shadow-sm space-y-4 transition-all duration-200 hover:border-[#363b36]">
      {/* Ink Blot Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#524a18] opacity-15 blur-2xl pointer-events-none mix-blend-screen"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262a26] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#0e2413] border border-[#1b4224] flex items-center justify-center text-[#05c92f]">
            <FaUtensils className="text-xs" />
          </div>
          <div>
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#9a978f] block">
              PRE-ORDER DEMAND BREAKDOWN
            </span>
            <h3 className="text-base font-semibold text-[#faf9f5]">Item Demand Ranking</h3>
          </div>
        </div>
        <span className="text-xs text-[#9a978f] font-semibold bg-[#0a0c0a] px-3 py-1 rounded-full border border-[#262a26]">
          {dateLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rankedItemDemand.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#0a0c0a] p-3.5 rounded-xl border border-[#262a26] flex items-center justify-between gap-3 shadow-sm transition-all duration-200 hover:border-[#363b36]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#171a17] border border-[#363b36] text-[#05c92f] font-extrabold text-[11px] flex items-center justify-center shrink-0 tabular-nums">
                #{idx + 1}
              </span>
              <span className="text-xs font-semibold text-[#faf9f5] truncate">{item.itemName}</span>
            </div>
            <span className="bg-[#0e2413] text-[#05c92f] border border-[#1b4224] text-xs font-bold px-3 py-1 rounded-full shrink-0 tabular-nums">
              {item.totalQty} pre-ordered
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
