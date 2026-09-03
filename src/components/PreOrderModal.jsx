"use client";

import { useState } from "react";

const MENU_ITEMS = [
  { id: "pb-sandwich", name: "Peanut Butter Banana Sandwich", price: 50, category: "Sandwich" },
  { id: "chia-pudding", name: "Chia Pudding", price: 55, category: "Pudding" },
  { id: "rice-cakes", name: "Rice Cakes", price: 50, category: "Snack" },
  { id: "oats", name: "Whole Grain Oats", price: 65, category: "Bowl" },
  { id: "muesli", name: "Toasted Muesli", price: 70, category: "Bowl" },
  { id: "fruit-bowl", name: "Fresh Fruit Bowl", price: 50, category: "Bowl" },
];

export default function PreOrderModal({ isOpen, onClose, initialItem = null }) {
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    MENU_ITEMS.forEach((item) => {
      init[item.id] = initialItem && initialItem.id === item.id ? 1 : 0;
    });
    return init;
  });

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState("07:00 AM");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleQtyChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const calculateTotal = () => {
    return MENU_ITEMS.reduce((sum, item) => sum + (quantities[item.id] || 0) * item.price, 0);
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();
    const selected = MENU_ITEMS.filter((item) => (quantities[item.id] || 0) > 0);

    if (selected.length === 0) {
      alert("Please select at least 1 item to pre-order!");
      return;
    }

    let orderSummary = selected
      .map((item) => `• ${item.name} x ${quantities[item.id]} (₹${item.price * quantities[item.id]})`)
      .join("\n");

    const text = `🐾 *FITCAT PRE-BOOKING ORDER* 🐾\n` +
      `-----------------------------\n` +
      `👤 *Customer*: ${customerName || "Customer"}\n` +
      `📅 *Pre-Booking Date*: ${bookingDate}\n` +
      `⏰ *Pickup Time Slot*: ${timeSlot} (Store timings: 6:30 AM - 9:30 AM)\n` +
      `📍 *Location*: Vikhroli East Railway Station\n` +
      `-----------------------------\n` +
      `🍽️ *ORDER ITEMS*:\n${orderSummary}\n` +
      `-----------------------------\n` +
      `💰 *Total Amount*: ₹${calculateTotal()}\n` +
      (notes ? `📝 *Notes*: ${notes}\n` : "") +
      `-----------------------------\n` +
      `Please confirm my pre-order! Eat Clean. Feel Great! 🌿`;

    const whatsappUrl = `https://wa.me/917977034609?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-fitcat-green text-fitcat-cream w-full max-w-lg rounded-2xl border-2 border-fitcat-gold shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-fitcat-darkgreen border-b border-fitcat-gold/30 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-fitcat-gold flex items-center gap-2">
              <span>📲</span> Pre-Book Food via WhatsApp
            </h3>
            <p className="text-xs text-fitcat-cream/80">Order ahead for store timings 6:30 AM - 9:30 AM</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-fitcat-gold/20 hover:bg-fitcat-gold/40 text-fitcat-gold font-bold flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleWhatsAppSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-fitcat-gold mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Harsh K."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-fitcat-darkgreen border border-fitcat-gold/40 rounded-lg p-2 text-sm text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-fitcat-gold mb-1">Pre-Booking Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-fitcat-darkgreen border border-fitcat-gold/40 rounded-lg p-2 text-sm text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
              />
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-bold text-fitcat-gold mb-1">Pickup Time (Store: 6:30 AM - 9:30 AM)</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full bg-fitcat-darkgreen border border-fitcat-gold/40 rounded-lg p-2 text-sm text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
            >
              <option value="06:30 AM">06:30 AM (Opening Slot)</option>
              <option value="07:00 AM">07:00 AM</option>
              <option value="07:30 AM">07:30 AM</option>
              <option value="08:00 AM">08:00 AM (Peak Rush)</option>
              <option value="08:30 AM">08:30 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="09:30 AM">09:30 AM (Last Call)</option>
            </select>
          </div>

          {/* Menu Item Selection */}
          <div>
            <label className="block text-xs font-bold text-fitcat-gold mb-2">Select Your Food Items</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {MENU_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-fitcat-darkgreen/60 p-2.5 rounded-lg border border-fitcat-gold/20">
                  <div>
                    <p className="text-sm font-semibold text-fitcat-cream">{item.name}</p>
                    <p className="text-xs text-fitcat-gold font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, -1)}
                      className="w-7 h-7 rounded bg-fitcat-gold/20 hover:bg-fitcat-gold/40 text-fitcat-gold font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{quantities[item.id] || 0}</span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item.id, 1)}
                      className="w-7 h-7 rounded bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-fitcat-gold mb-1">Special Instructions (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Less sugar, extra fruit topping, extra honey..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-fitcat-darkgreen border border-fitcat-gold/40 rounded-lg p-2 text-xs text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
            ></textarea>
          </div>

          {/* Summary & Submit */}
          <div className="pt-3 border-t border-fitcat-gold/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-fitcat-cream/70 block">Total Amount</span>
              <span className="text-2xl font-black text-fitcat-gold">₹{calculateTotal()}</span>
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-500 text-white font-black py-3 px-6 rounded-xl shadow-lg flex items-center gap-2 transition hover:scale-105"
            >
              <span>💬</span> Send WhatsApp Pre-Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
