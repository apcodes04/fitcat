"use client";

import { useState, useEffect } from "react";
import { saveOrderToFirestore } from "@/lib/orders";
import { subscribeToMenuItems } from "@/lib/menu";
import WhatsAppIcon from "./WhatsAppIcon";
import { FaPlus, FaMinus, FaTrashCan, FaXmark, FaMoon } from "react-icons/fa6";

export default function PreOrderModal({ isOpen, onClose, initialItem = null }) {
  const [menuItems, setMenuItems] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [showItemPicker, setShowItemPicker] = useState(false);

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState("7:00 AM to 7:15 AM");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Subscribe to live menu items & prices from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToMenuItems((liveItems) => {
      const inStockItems = liveItems.filter((item) => item.inStock !== false);
      setMenuItems(inStockItems);

      // Initialize selected items array
      if (initialItem) {
        const found = inStockItems.find((i) => i.id === initialItem.id);
        if (found) {
          setOrderItems([{ id: found.id, name: found.name, price: found.price, qty: 1 }]);
        }
      }
    });
    return () => unsubscribe && unsubscribe();
  }, [initialItem]);

  if (!isOpen) return null;

  // Add an item to current order list (only if not already added)
  const handleAddItemToOrder = (item) => {
    setOrderItems((prev) => [
      ...prev,
      { id: item.id, name: item.name, price: item.price, qty: 1 },
    ]);
    setShowItemPicker(false);
  };

  // Modify quantity of an already added item (+ / -)
  const handleQtyChange = (id, delta) => {
    setOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item completely from order list
  const handleRemoveItem = (id) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Filter available items that have NOT been added to the order yet
  const availableItemsToAdd = menuItems.filter(
    (mItem) => !orderItems.some((oItem) => oItem.id === mItem.id)
  );

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  };

  const handleWhatsAppSubmit = async (e) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      alert("Please add at least 1 item to your order using the 'Add Items' button!");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: customerName || "Customer",
      customerPhone: customerPhone || "Not provided",
      bookingDate,
      timeSlot,
      items: orderItems.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      totalAmount: calculateTotal(),
      notes,
      source: "website_whatsapp",
    };

    // 1. Save order to Firebase Firestore in background (non-blocking for instant redirection)
    saveOrderToFirestore(orderPayload).catch((err) =>
      console.error("Firestore save error:", err)
    );

    // 2. Format WhatsApp Pre-Filled Message with clean standard emojis
    let orderSummary = orderItems
      .map((item) => `• ${item.name} x ${item.qty} (₹${item.price * item.qty})`)
      .join("\n");

    const text =
      `🥗 *FITCAT PRE-BOOKING ORDER* 🥗\n` +
      `-----------------------------\n` +
      `👤 *Customer*: ${customerName || "Customer"}\n` +
      (customerPhone ? `📞 *Phone*: ${customerPhone}\n` : "") +
      `📅 *Pre-Booking Date*: ${bookingDate}\n` +
      `⏰ *Pickup Time Slot*: ${timeSlot} (Store timings: 6:30 AM to 9:30 AM)\n` +
      `📍 *Location*: Vikhroli East Railway Station\n` +
      `-----------------------------\n` +
      `🛒 *ORDER ITEMS*:\n${orderSummary}\n` +
      `-----------------------------\n` +
      `💰 *Total Amount*: ₹${calculateTotal()}\n` +
      (notes ? `📝 *Notes*: ${notes}\n` : "") +
      `-----------------------------\n` +
      `✨ Please confirm my pre-order! Eat Clean. Feel Great! 🌿`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=917977034609&text=${encodeURIComponent(text)}`;

    // 3. Use direct window.location.href so Instagram in-app browser & iOS Safari launch WhatsApp deep-link instantly
    window.location.href = whatsappUrl;

    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#162118] text-[#FAF9F5] w-full max-w-lg rounded-2xl border border-[#263629] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#0a140c] border-b border-[#263629] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#E5C158] flex items-center gap-2.5">
              <WhatsAppIcon className="w-6 h-6" color="#E5C158" />
              <span>Pre-Book Food via WhatsApp</span>
            </h3>
            <p className="text-xs text-[#9A978F] mt-0.5">
              Store Pickup: <strong>6:30 AM to 9:30 AM</strong> • Pre-orders received till <strong>11:00 PM</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#162118] hover:bg-[#263629] text-[#9A978F] hover:text-[#FAF9F5] font-bold flex items-center justify-center transition border border-[#263629]"
          >
            ✕
          </button>
        </div>

        {/* Notice Banner */}
        <div className="bg-[#0e2413] px-4 py-2 text-[11px] text-[#05c92f] border-b border-[#1b4224] flex items-center gap-2 font-medium">
          <FaMoon className="w-3.5 h-3.5 text-[#05c92f] flex-shrink-0" />
          <span>Pre-orders are accepted till <strong>11:00 PM</strong> for next-day morning pickup.</span>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleWhatsAppSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#E5C158] mb-1">Your Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Harsh K."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#E5C158] mb-1">Phone Number (Optional)</label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#E5C158] mb-1">Pre-Booking Date</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#E5C158] mb-1">Pickup Time Slot (15 min)</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#0a140c] border border-[#263629] rounded-lg p-2 text-sm text-[#FAF9F5] focus:outline-none focus:border-[#05c92f]"
              >
                <option value="6:30 AM to 6:45 AM">6:30 AM to 6:45 AM (Opening)</option>
                <option value="6:45 AM to 7:00 AM">6:45 AM to 7:00 AM</option>
                <option value="7:00 AM to 7:15 AM">7:00 AM to 7:15 AM</option>
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

          {/* Selected Food Items & Add Items Flow */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-fitcat-gold">Selected Food Items</label>
              <span className="text-[11px] text-fitcat-cream/80 font-bold">Prices (₹)</span>
            </div>

            {/* List of currently selected items */}
            {orderItems.length === 0 ? (
              <div className="bg-fitcat-darkgreen/40 p-4 rounded-xl border border-dashed border-fitcat-gold/30 text-center text-xs text-fitcat-cream/60">
                No items added yet. Click <strong>"➕ Add Items"</strong> below to choose from our menu!
              </div>
            ) : (
              <div className="space-y-2 mb-3">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-fitcat-darkgreen p-2.5 rounded-xl border border-fitcat-gold/30 shadow"
                  >
                    <div className="flex-1 pr-2">
                      <p className="text-sm font-bold text-fitcat-cream">{item.name}</p>
                      <p className="text-xs text-fitcat-gold font-extrabold">Price: ₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-fitcat-green px-2 py-1 rounded-lg border border-fitcat-gold/20">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, -1)}
                          className="w-6 h-6 rounded bg-fitcat-gold/20 hover:bg-fitcat-gold/40 text-fitcat-gold font-extrabold text-xs flex items-center justify-center transition"
                          title="Decrease Quantity"
                        >
                          <FaMinus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-black text-fitcat-cream">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-6 h-6 rounded bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-extrabold text-xs flex items-center justify-center transition"
                          title="Increase Quantity"
                        >
                          <FaPlus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {/* Item Total & Remove */}
                      <span className="text-xs font-black text-fitcat-gold w-12 text-right">
                        ₹{item.price * item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-300 text-xs p-1"
                        title="Remove item"
                      >
                        <FaTrashCan className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* "Add Items" Button & Pop-Up Modal */}
            <div className="relative">
              {availableItemsToAdd.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowItemPicker(!showItemPicker)}
                  className="w-full bg-fitcat-gold/20 hover:bg-fitcat-gold text-fitcat-gold hover:text-fitcat-darkgreen border border-fitcat-gold font-black py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
                >
                  <FaPlus className="w-3 h-3" /> {showItemPicker ? "Close Item Picker" : "Add Items to Order"}
                </button>
              )}

              {/* Item Picker Pop-Up Window */}
              {showItemPicker && availableItemsToAdd.length > 0 && (
                <div className="mt-2 bg-fitcat-darkgreen border-2 border-fitcat-gold rounded-xl p-3 shadow-2xl space-y-2 animate-fade-in z-20">
                  <div className="flex items-center justify-between border-b border-fitcat-gold/20 pb-1.5">
                    <span className="text-xs font-extrabold text-fitcat-gold">Choose from Menu:</span>
                    <button
                      type="button"
                      onClick={() => setShowItemPicker(false)}
                      className="text-xs text-fitcat-cream/60 hover:text-white"
                    >
                      <FaXmark className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {availableItemsToAdd.map((mItem) => (
                      <div
                        key={mItem.id}
                        onClick={() => handleAddItemToOrder(mItem)}
                        className="flex items-center justify-between p-2 rounded-lg bg-fitcat-green/80 hover:bg-fitcat-green border border-fitcat-gold/20 cursor-pointer transition"
                      >
                        <div>
                          <p className="text-xs font-bold text-fitcat-cream">{mItem.name}</p>
                          <span className="text-[11px] text-fitcat-gold font-extrabold">Price: ₹{mItem.price}</span>
                        </div>
                        <span className="bg-fitcat-gold text-fitcat-darkgreen font-black text-[11px] px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                          <FaPlus className="w-2.5 h-2.5" /> Add
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Special Instructions (Optional) */}
          <div>
            <label className="block text-xs font-bold text-fitcat-gold mb-1">Special Instructions (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Extra fruits, extra honey..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-fitcat-darkgreen border border-fitcat-gold/40 rounded-lg p-2 text-xs text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
            ></textarea>
          </div>

          {/* Summary & Submit */}
          <div className="pt-3 border-t border-fitcat-gold/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-fitcat-cream/70 block font-semibold">Total Amount</span>
              <span className="text-2xl font-black text-fitcat-gold">₹{calculateTotal()}</span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || orderItems.length === 0}
              className="bg-green-600 hover:bg-green-500 text-white font-black py-3 px-6 rounded-xl shadow-lg flex items-center gap-2 transition hover:scale-105 disabled:opacity-50"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>{isSubmitting ? "Logging Order..." : "Send WhatsApp Pre-Order"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
