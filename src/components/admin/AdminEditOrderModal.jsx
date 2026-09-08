"use client";

import { useState, useEffect } from "react";
import { updateOrderInFirestore, formatBookingDateText } from "@/lib/orders";
import { FaXmark, FaPlus, FaMinus, FaTrashCan, FaPenToSquare } from "react-icons/fa6";

export default function AdminEditOrderModal({
  order,
  menuItems = [],
  onClose,
  onOrderUpdated,
}) {
  const [customerName, setCustomerName] = useState(order?.customerName || "");
  const [customerPhone, setCustomerPhone] = useState(order?.customerPhone || "");
  const [phoneError, setPhoneError] = useState("");
  const [bookingDate, setBookingDate] = useState(order?.bookingDate || "");
  const [timeSlot, setTimeSlot] = useState(order?.timeSlot || "7:00 AM to 7:15 AM");
  const [items, setItems] = useState(order?.items || []);
  const [notes, setNotes] = useState(order?.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [showAddItemPicker, setShowAddItemPicker] = useState(false);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName || "");
      setCustomerPhone(order.customerPhone || "");
      setBookingDate(order.bookingDate || "");
      setTimeSlot(order.timeSlot || "7:00 AM to 7:15 AM");
      setItems(order.items || []);
      setNotes(order.notes || "");
    }
  }, [order]);

  if (!order) return null;

  const calculateTotal = () => {
    return items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 1), 0);
  };

  const handleQtyChange = (idx, delta) => {
    setItems((prev) =>
      prev
        .map((item, i) => {
          if (i === idx) {
            const newQty = (Number(item.qty) || 1) + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleRemoveItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddItem = (menuItem) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.name === menuItem.name);
      if (existingIdx >= 0) {
        return prev.map((item, i) =>
          i === existingIdx ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { name: menuItem.name, qty: 1, price: menuItem.price }];
    });
    setShowAddItemPicker(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number (e.g. 9876543210)");
      return;
    }
    setPhoneError("");

    if (items.length === 0) {
      alert("Order must contain at least 1 item!");
      return;
    }

    setIsSaving(true);

    const updatedPayload = {
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      bookingDate: formatBookingDateText(bookingDate),
      timeSlot,
      items: items.map((i) => ({ name: i.name, qty: Number(i.qty), price: Number(i.price) })),
      totalAmount: calculateTotal(),
      notes,
    };

    const res = await updateOrderInFirestore(order.id, updatedPayload);
    setIsSaving(false);

    if (res.success) {
      onOrderUpdated && onOrderUpdated(`Updated order for ${customerName}`);
      onClose();
    } else {
      alert(`Error updating order: ${res.error}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#171a17] border border-[#262a26] rounded-xl p-6 max-w-lg w-full text-[#faf9f5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#262a26] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
              <FaPenToSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#faf9f5]">
                Edit Pre-Order Ticket
              </h3>
              <p className="text-xs text-[#9a978f]">Order ID: {order.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9a978f] hover:text-[#faf9f5] p-1.5 rounded-full hover:bg-[#262a26] transition"
          >
            <FaXmark className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Customer Name & Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#faf9f5] mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#faf9f5] mb-1">
                Mobile Number <span className="text-red-400">* (10 Digits)</span>
              </label>
              <input
                type="tel"
                required
                maxLength={14}
                value={customerPhone}
                onChange={(e) => {
                  setCustomerPhone(e.target.value);
                  if (phoneError) setPhoneError("");
                }}
                className={`w-full bg-[#0a0c0a] border ${
                  phoneError ? "border-red-500" : "border-[#262a26]"
                } rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]`}
              />
              {phoneError && (
                <p className="text-[11px] font-bold text-red-400 mt-1">{phoneError}</p>
              )}
            </div>
          </div>

          {/* Booking Date & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#faf9f5] mb-1">
                Pickup Date
              </label>
              <input
                type="text"
                required
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
                placeholder="e.g. 8th Sept, 2026"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#faf9f5] mb-1">
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-sm text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
              >
                <option value="7:00 AM to 7:15 AM">7:00 AM to 7:15 AM (Store Opening)</option>
                <option value="7:15 AM to 7:30 AM">7:15 AM to 7:30 AM</option>
                <option value="7:30 AM to 7:45 AM">7:30 AM to 7:45 AM</option>
                <option value="7:45 AM to 8:00 AM">7:45 AM to 8:00 AM</option>
                <option value="8:00 AM to 8:15 AM">8:00 AM to 8:15 AM (Peak)</option>
                <option value="8:15 AM to 8:30 AM">8:15 AM to 8:30 AM</option>
                <option value="8:30 AM to 8:45 AM">8:30 AM to 8:45 AM</option>
                <option value="8:45 AM to 9:00 AM">8:45 AM to 9:00 AM</option>
                <option value="9:00 AM to 9:15 AM">9:00 AM to 9:15 AM</option>
                <option value="9:15 AM to 9:30 AM">9:15 AM to 9:30 AM (Last Call)</option>
              </select>
            </div>
          </div>

          {/* Edit Order Items & Quantities */}
          <div className="space-y-2 pt-2 border-t border-[#262a26]">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                Order Items & Quantities
              </label>
              <button
                type="button"
                onClick={() => setShowAddItemPicker(!showAddItemPicker)}
                className="text-xs font-bold text-[#05c92f] hover:underline flex items-center gap-1"
              >
                <FaPlus className="text-[10px]" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Menu Items Selector dropdown if adding item */}
            {showAddItemPicker && (
              <div className="bg-[#0a0c0a] p-3 rounded-lg border border-[#262a26] space-y-2 mb-2">
                <p className="text-[11px] text-[#9a978f] font-semibold">Select item to add:</p>
                <div className="flex flex-wrap gap-2">
                  {menuItems.map((m) => (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => handleAddItem(m)}
                      className="bg-[#171a17] hover:bg-[#05c92f] text-[#faf9f5] hover:text-[#0f110f] border border-[#262a26] px-3 py-1 rounded-full text-xs font-semibold transition"
                    >
                      {m.name} (<span className="text-yellow-400">₹{m.price}</span>)
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#0a0c0a] p-3 rounded-lg border border-[#262a26]"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="text-xs font-semibold text-[#faf9f5] truncate">{item.name}</p>
                    <p className="text-[11px] text-yellow-400 font-extrabold">
                      ₹{item.price} x {item.qty} = ₹{item.price * item.qty}
                    </p>
                  </div>

                  {/* Qty Controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-[#171a17] rounded-full border border-[#262a26]">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, -1)}
                        className="px-2.5 py-1 text-xs text-[#faf9f5] hover:bg-[#262a26] rounded-l-full transition"
                      >
                        <FaMinus className="w-2.5 h-2.5" />
                      </button>
                      <span className="px-2.5 text-xs font-extrabold text-[#faf9f5] tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(idx, 1)}
                        className="px-2.5 py-1 text-xs text-[#faf9f5] hover:bg-[#262a26] rounded-r-full transition"
                      >
                        <FaPlus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-red-500/20 transition"
                      title="Remove item"
                    >
                      <FaTrashCan className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#faf9f5] mb-1">
              Order Notes / Customer Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0a0c0a] border border-[#262a26] rounded-lg p-2.5 text-xs text-[#faf9f5] focus:outline-none focus:border-[#05c92f]"
              placeholder="Special notes..."
            />
          </div>

          {/* Total Price Display in BOLD YELLOW */}
          <div className="flex items-center justify-between bg-[#0a0c0a] p-3 rounded-lg border border-[#262a26]">
            <span className="text-xs font-semibold text-[#9a978f] uppercase tracking-wider">
              Updated Total Amount:
            </span>
            <span className="text-xl font-extrabold text-yellow-400 tabular-nums">
              ₹{calculateTotal()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-[#262a26] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#262a26] text-xs font-semibold text-[#9a978f] hover:text-[#faf9f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 rounded-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <FaPenToSquare className="text-xs" />
              <span>{isSaving ? "Saving..." : "Save Order Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
