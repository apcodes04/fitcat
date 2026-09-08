"use client";

import { formatBookingDateText } from "@/lib/orders";
import { FaPhone, FaCalendarDays, FaClock, FaNoteSticky, FaTrashCan, FaPenToSquare, FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function AdminCustomerGroupCard({
  group,
  isExpanded,
  onToggleExpand,
  onStatusChange,
  onEditOrder,
  onDeleteOrder,
}) {
  return (
    <div className="bg-[#0a0c0a] rounded-xl border border-[#262a26] overflow-hidden shadow-sm transition-all duration-200 hover:border-[#363b36]">
      {/* Customer Group Header Banner */}
      <div
        onClick={onToggleExpand}
        className="bg-[#171a17] p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-[#1f241f] transition-all duration-200 border-b border-[#262a26]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#0e2413] border border-[#1b4224] flex items-center justify-center text-[#05c92f] font-black text-sm shrink-0">
            {group.customerName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-[#05c92f] font-mono bg-[#0a0c0a] px-2.5 py-0.5 rounded-md border border-[#262a26] flex items-center gap-1.5 shadow-inner">
                <FaPhone className="text-[10px] text-[#05c92f]" />
                <span>{group.primaryKeyPhone || group.customerPhone || "No Phone"}</span>
              </span>
              <h4 className="font-semibold text-sm text-[#faf9f5] truncate">{group.customerName}</h4>
              <span className="bg-[#0e2413] text-[#05c92f] border border-[#1b4224] text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
                {group.ordersList.length} {group.ordersList.length === 1 ? "Order" : "Orders"}
              </span>
            </div>
            {group.customerPhone && (
              <a
                href={`tel:${group.customerPhone}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] text-[#9a978f] hover:text-[#05c92f] hover:underline font-semibold inline-flex items-center gap-1.5 mt-1"
              >
                <span>Click to call customer</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-[#05c92f] block uppercase tracking-wider font-bold">TOTAL SPENT</span>
            <span className="text-xl sm:text-2xl font-black text-[#05c92f] tabular-nums">₹{group.totalSpent}</span>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-[#9a978f] block uppercase tracking-wider font-medium">Items Pre-Ordered</span>
            <span className="text-base font-semibold text-[#faf9f5] tabular-nums">{group.totalItemsCount} items</span>
          </div>
          <div className="text-[#faf9f5] p-2 rounded-full hover:bg-[#262a26] transition">
            {isExpanded ? <FaChevronUp className="w-4 h-4" /> : <FaChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Sub-Orders List under Customer */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-3 bg-[#0a0c0a] w-full max-w-full overflow-hidden">
          {group.ordersList.map((order) => (
            <div
              key={order.id}
              className="bg-[#171a17] p-3.5 sm:p-4 rounded-xl border border-[#262a26] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4 transition-all duration-200 hover:border-[#363b36] w-full max-w-full overflow-hidden"
            >
              <div className="space-y-2 flex-1 min-w-0 w-full">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#faf9f5]">
                  <span className="inline-flex items-center gap-1.5 font-semibold bg-[#0a0c0a] px-2.5 sm:px-3 py-1 rounded-full border border-[#262a26]">
                    <FaCalendarDays className="text-[10px] text-[#05c92f]" />
                    <span>Pickup Date: <strong className="text-[#05c92f]">{formatBookingDateText(order.bookingDate)}</strong></span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-semibold bg-[#0a0c0a] px-2.5 sm:px-3 py-1 rounded-full border border-[#262a26]">
                    <FaClock className="text-[10px] text-[#05c92f]" />
                    <span>Time Slot: <strong className="text-[#faf9f5]">{order.timeSlot}</strong></span>
                  </span>
                  <span className="text-[11px] text-[#9a978f] ml-auto">Placed: {order.formattedTime}</span>
                </div>

                {/* Pre-Ordered Items */}
                <div className="pt-1">
                  <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#9a978f] mb-1">
                    Items Pre-Ordered:
                  </p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {order.items?.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-[#0a0c0a] px-2.5 sm:px-3 py-1 rounded-full text-xs border border-[#262a26] font-medium text-[#faf9f5]"
                      >
                        {item.name} × <strong className="text-[#05c92f]">{item.qty}</strong> (
                        <span className="text-yellow-400 font-extrabold">₹{item.price * item.qty}</span>)
                      </span>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <p className="text-xs text-[#9a978f] italic pt-1 flex items-center gap-1.5">
                    <FaNoteSticky className="text-xs text-[#05c92f] shrink-0" />
                    <span>Note: {order.notes}</span>
                  </p>
                )}
              </div>

              {/* Amount, Orange Edit Button, Status Dropdown & Delete (Flex Wrap for 100% Fit on Mobile) */}
              <div className="flex flex-col items-start sm:items-end gap-2 w-full md:w-auto border-t md:border-t-0 border-[#262a26] pt-3 md:pt-0 shrink-0">
                <span className="text-xl font-extrabold text-yellow-400 tabular-nums self-end">₹{order.totalAmount}</span>

                <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 w-full">
                  {/* ORANGE EDIT ORDER BUTTON */}
                  <button
                    onClick={() => onEditOrder && onEditOrder(order)}
                    className="bg-orange-600/25 hover:bg-orange-600 text-orange-300 hover:text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full border border-orange-500/40 transition flex items-center gap-1 shadow-sm shrink-0"
                    title="Edit Order Details & Quantities"
                  >
                    <FaPenToSquare className="w-3 h-3 text-orange-400" />
                    <span>Edit</span>
                  </button>

                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => onStatusChange(order.id, e.target.value)}
                    className={`text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border focus:outline-none cursor-pointer shrink-0 ${
                      order.status === "Completed"
                        ? "bg-green-600/20 text-green-300 border-green-500/40"
                        : order.status === "Confirmed"
                        ? "bg-blue-600/20 text-blue-300 border-blue-500/40"
                        : order.status === "Cancelled"
                        ? "bg-red-600/20 text-red-300 border-red-500/40"
                        : "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                    }`}
                  >
                    <option value="Pending" className="bg-[#171a17] text-[#faf9f5]">● Pending</option>
                    <option value="Confirmed" className="bg-[#171a17] text-[#faf9f5]">● Confirmed</option>
                    <option value="Completed" className="bg-[#171a17] text-[#faf9f5]">● Completed</option>
                    <option value="Cancelled" className="bg-[#171a17] text-[#faf9f5]">● Cancelled</option>
                  </select>

                  <button
                    onClick={() => onDeleteOrder(order.id)}
                    className="bg-red-600/15 hover:bg-red-600 hover:text-white text-red-300 text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full border border-red-500/30 transition flex items-center gap-1 shrink-0"
                    title="Delete Order Log"
                  >
                    <FaTrashCan className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
