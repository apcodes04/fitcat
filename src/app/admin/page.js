"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { subscribeToOrders, updateOrderStatusInFirestore } from "@/lib/orders";

const DEFAULT_ITEMS = [
  { id: "pb-sandwich", name: "Peanut Butter Banana Sandwich", price: 50, category: "Sandwich", badge: "Protein Rich", description: "Creamy peanut butter and fresh, sweet banana slices layered for a classic, protein-packed energy boost.", image: "/images/menu_poster.jpeg", inStock: true },
  { id: "chia-pudding", name: "Superfood Chia Pudding", price: 55, category: "Pudding", badge: "Energy Boost", description: "A velvety, nutrient-rich delight with a perfectly creamy texture and a hint of natural sweetness.", image: "/images/hero_poster.jpeg", inStock: true },
  { id: "rice-cakes", name: "Crispy Rice Cakes", price: 50, category: "Snack", badge: "Light Crunch", description: "Light, airy, and crisp—the perfect satisfying crunch to keep you fueled and focused.", image: "/images/menu_poster.jpeg", inStock: true },
  { id: "oats", name: "Whole Grain Oats", price: 65, category: "Bowl", badge: "Hearty Fiber", description: "A warm, comforting bowl of whole-grain oats, rich in fiber and simmered to a perfect, hearty texture.", image: "/images/hero_poster.jpeg", inStock: true },
  { id: "muesli", name: "Toasted Nut Muesli", price: 70, category: "Bowl", badge: "Wholesome Crunch", description: "A wholesome, satisfying crunch of toasted oats, premium nuts, and vibrant dried fruits.", image: "/images/menu_poster.jpeg", inStock: true },
  { id: "fruit-bowl", name: "Fresh Fruit Bowl", price: 50, category: "Bowl", badge: "100% Natural", description: "A vibrant, refreshing medley of freshly chopped fruits bursting with natural sweetness.", image: "/images/hero_poster.jpeg", inStock: true },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "menu"
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [editingItem, setEditingItem] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const isAuthorizedEmail = (email) => {
    if (!email) return false;
    const allowedEmails = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    return allowedEmails.includes(email.toLowerCase());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAuthorizedEmail(user.email)) {
        setCurrentUser(user);
        setAuthed(true);
      } else {
        setAuthed(false);
        router.push("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Subscribe to real-time Firebase Firestore orders
  useEffect(() => {
    if (!authed) return;
    const unsubscribe = subscribeToOrders((liveOrders) => {
      setOrders(liveOrders);
    });
    return () => unsubscribe && unsubscribe();
  }, [authed]);

  if (!authed) return null;

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatusInFirestore(orderId, newStatus);
    setStatusMessage(`Updated order status to ${newStatus}`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handlePriceChange = (id, newPrice) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: Number(newPrice) || 0 } : item))
    );
  };

  const handleStockToggle = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    setItems((prev) => prev.map((item) => (item.id === editingItem.id ? editingItem : item)));
    setEditingItem(null);
    setStatusMessage("✅ Menu changes saved!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  // Analytics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="min-h-screen bg-fitcat-green text-fitcat-cream font-sans">
      {/* Admin Top Header */}
      <header className="bg-fitcat-darkgreen border-b border-fitcat-gold/30 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <Logo className="h-12 w-auto" />
          <span className="bg-fitcat-gold text-fitcat-darkgreen text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Admin Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          {currentUser && (
            <span className="text-xs text-fitcat-gold font-bold bg-fitcat-green px-3 py-1.5 rounded-full border border-fitcat-gold/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              {currentUser.email}
            </span>
          )}
          <a href="/" target="_blank" rel="noreferrer" className="text-xs font-bold text-fitcat-cream hover:text-fitcat-gold">
            🌐 Live Site
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition border border-red-500/40"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-fitcat-darkgreen/60 border-b border-fitcat-gold/20 px-6 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-fitcat-gold text-fitcat-darkgreen shadow-lg"
                : "bg-fitcat-green text-fitcat-cream hover:bg-fitcat-gold/20"
            }`}
          >
            <span>📊</span> WhatsApp Orders Log ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
              activeTab === "menu"
                ? "bg-fitcat-gold text-fitcat-darkgreen shadow-lg"
                : "bg-fitcat-green text-fitcat-cream hover:bg-fitcat-gold/20"
            }`}
          >
            <span>🍽️</span> Food Menu & Prices
          </button>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Status Notification */}
        {statusMessage && (
          <div className="bg-green-600/90 text-white font-bold p-3 rounded-xl shadow border border-green-400 text-center animate-bounce text-sm">
            {statusMessage}
          </div>
        )}

        {/* TAB 1: REAL-TIME WHATSAPP ORDERS LOG */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-fitcat-darkgreen p-5 rounded-2xl border-2 border-fitcat-gold/30 shadow-lg">
                <span className="text-xs font-bold text-fitcat-gold uppercase tracking-wider">Total Recorded Orders</span>
                <h3 className="text-3xl font-black text-fitcat-cream mt-1">{orders.length}</h3>
              </div>
              <div className="bg-fitcat-darkgreen p-5 rounded-2xl border-2 border-fitcat-gold/30 shadow-lg">
                <span className="text-xs font-bold text-fitcat-gold uppercase tracking-wider">Total Projected Revenue</span>
                <h3 className="text-3xl font-black text-fitcat-gold mt-1">₹{totalRevenue}</h3>
              </div>
              <div className="bg-fitcat-darkgreen p-5 rounded-2xl border-2 border-fitcat-gold/30 shadow-lg">
                <span className="text-xs font-bold text-fitcat-gold uppercase tracking-wider">Pending Orders Queue</span>
                <h3 className="text-3xl font-black text-yellow-400 mt-1">{pendingOrdersCount}</h3>
              </div>
            </div>

            {/* Orders Table / Cards */}
            <div className="bg-fitcat-darkgreen rounded-2xl border-2 border-fitcat-gold/30 p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-fitcat-gold/20 pb-4">
                <div>
                  <h2 className="text-xl font-black text-fitcat-gold">Real-Time Firebase Orders Queue</h2>
                  <p className="text-xs text-fitcat-cream/70">Live orders received from website WhatsApp pre-order triggers</p>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-300 border border-green-500/40 text-xs px-3 py-1 rounded-full font-bold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Live Firebase Listener Active
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-fitcat-cream/60 text-sm space-y-2">
                  <span className="text-4xl block">📱</span>
                  <p>No orders logged yet. Place a test pre-order on the main site to see it appear here live!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-fitcat-green p-5 rounded-xl border border-fitcat-gold/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-extrabold text-base text-fitcat-cream">{order.customerName}</h4>
                          {order.customerPhone && (
                            <a href={`tel:${order.customerPhone}`} className="text-xs text-fitcat-gold hover:underline">
                              📞 {order.customerPhone}
                            </a>
                          )}
                          <span className="text-[11px] text-fitcat-cream/60">{order.formattedTime}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-fitcat-gold">
                          <span>📅 Date: <strong>{order.bookingDate}</strong></span>
                          <span>•</span>
                          <span>⏰ Time: <strong>{order.timeSlot}</strong></span>
                        </div>

                        {/* Order Items list */}
                        <div className="pt-2">
                          <p className="text-xs font-bold text-fitcat-cream/80 mb-1">Items Ordered:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items?.map((item, idx) => (
                              <span key={idx} className="bg-fitcat-darkgreen px-2.5 py-1 rounded-lg text-xs border border-fitcat-gold/20 font-medium">
                                {item.name} × <strong>{item.qty}</strong> (₹{item.price * item.qty})
                              </span>
                            ))}
                          </div>
                        </div>

                        {order.notes && (
                          <p className="text-xs text-fitcat-cream/70 italic pt-1">📝 Note: {order.notes}</p>
                        )}
                      </div>

                      {/* Status & Price */}
                      <div className="flex flex-col items-end gap-2 w-full md:w-auto border-t md:border-t-0 border-fitcat-gold/20 pt-3 md:pt-0">
                        <span className="text-2xl font-black text-fitcat-gold">₹{order.totalAmount}</span>

                        <select
                          value={order.status || "Pending"}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                            order.status === "Completed"
                              ? "bg-green-600 text-white border-green-400"
                              : order.status === "Confirmed"
                              ? "bg-blue-600 text-white border-blue-400"
                              : order.status === "Cancelled"
                              ? "bg-red-600 text-white border-red-400"
                              : "bg-yellow-500 text-fitcat-darkgreen border-yellow-400"
                          }`}
                        >
                          <option value="Pending">🟡 Pending</option>
                          <option value="Confirmed">🔵 Confirmed</option>
                          <option value="Completed">🟢 Completed</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: FOOD MENU & PRICING MANAGER */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-fitcat-darkgreen p-6 rounded-2xl border-2 border-fitcat-gold/30 shadow-lg">
              <div>
                <h1 className="text-2xl font-black text-fitcat-gold">Menu & Price Manager</h1>
                <p className="text-xs text-fitcat-cream/80">Manage food prices, stock status, and item descriptions live.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-fitcat-darkgreen/90 p-5 rounded-2xl border-2 ${
                    item.inStock ? "border-fitcat-gold/40" : "border-red-500/40 opacity-75"
                  } shadow-xl flex flex-col justify-between space-y-4`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black text-fitcat-gold bg-fitcat-green px-2.5 py-1 rounded border border-fitcat-gold/30">
                        {item.category}
                      </span>
                      <button
                        onClick={() => handleStockToggle(item.id)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                          item.inStock
                            ? "bg-green-500/20 text-green-300 border border-green-500/40"
                            : "bg-red-500/20 text-red-300 border border-red-500/40"
                        }`}
                      >
                        {item.inStock ? "🟢 In Stock" : "🔴 Out of Stock"}
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-fitcat-cream mb-1">{item.name}</h3>
                    <p className="text-xs text-fitcat-cream/70 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-fitcat-gold/20">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-fitcat-gold">Price (₹)</label>
                      <div className="flex items-center gap-1">
                        <span className="text-fitcat-gold font-bold text-sm">₹</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          className="w-20 bg-fitcat-green border border-fitcat-gold/50 rounded-lg p-1.5 text-center text-sm font-bold text-fitcat-cream focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingItem(item)}
                      className="w-full bg-fitcat-gold/20 hover:bg-fitcat-gold text-fitcat-gold hover:text-fitcat-darkgreen font-bold py-2 rounded-xl border border-fitcat-gold text-xs transition"
                    >
                      ✏️ Edit Full Item Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-fitcat-darkgreen border-2 border-fitcat-gold rounded-2xl p-6 max-w-lg w-full text-fitcat-cream shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-fitcat-gold/30 pb-3">
              <h3 className="text-lg font-black text-fitcat-gold">Edit Menu Item</h3>
              <button onClick={() => setEditingItem(null)} className="text-fitcat-gold font-bold text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-fitcat-gold mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-fitcat-green border border-fitcat-gold/40 rounded-lg p-2 text-sm text-fitcat-cream"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-fitcat-gold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-fitcat-green border border-fitcat-gold/40 rounded-lg p-2 text-sm text-fitcat-cream"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-fitcat-gold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={editingItem.badge}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    className="w-full bg-fitcat-green border border-fitcat-gold/40 rounded-lg p-2 text-sm text-fitcat-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-fitcat-gold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-fitcat-green border border-fitcat-gold/40 rounded-lg p-2 text-xs text-fitcat-cream"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-fitcat-gold/30 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg bg-fitcat-green text-xs font-bold text-fitcat-cream"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded-lg bg-fitcat-gold text-fitcat-darkgreen text-xs font-black">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
