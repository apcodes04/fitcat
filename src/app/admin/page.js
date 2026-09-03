"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

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
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [editingItem, setEditingItem] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const isAuthed = sessionStorage.getItem("fitcat_admin_authed");
    if (!isAuthed) {
      router.push("/admin/login");
    } else {
      setAuthed(true);
    }
  }, [router]);

  if (!authed) return null;

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
    setStatusMessage("✅ Changes saved successfully!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleAddNewItem = () => {
    const newItem = {
      id: `item-${Date.now()}`,
      name: "New Fitcat Breakfast Bowl",
      price: 60,
      category: "Bowl",
      badge: "Fresh Special",
      description: "Delicious and healthy clean eating bowl.",
      image: "/images/hero_poster.jpeg",
      inStock: true,
    };
    setItems([...items, newItem]);
    setEditingItem(newItem);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("fitcat_admin_authed");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-fitcat-green text-fitcat-cream font-sans">
      {/* Admin Top Header */}
      <header className="bg-fitcat-darkgreen border-b border-fitcat-gold/30 px-8 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <Logo className="h-12 w-auto" />
          <span className="bg-fitcat-gold text-fitcat-darkgreen text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Admin Dashboard
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a href="/" target="_blank" rel="noreferrer" className="text-xs font-bold text-fitcat-gold hover:underline">
            🌐 View Live Site (fitcat.in)
          </a>
          <button
            onClick={handleLogout}
            className="bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition border border-red-500/40"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        {/* Status Notification */}
        {statusMessage && (
          <div className="bg-green-600/90 text-white font-bold p-4 rounded-xl shadow border border-green-400 text-center animate-bounce">
            {statusMessage}
          </div>
        )}

        {/* Overview Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-fitcat-darkgreen p-6 rounded-2xl border-2 border-fitcat-gold/30 shadow-lg">
          <div>
            <h1 className="text-2xl font-black text-fitcat-gold">Food Menu & Pricing Management</h1>
            <p className="text-xs text-fitcat-cream/80">Manage food prices, food image URLs, stock status, and menu items live.</p>
          </div>
          <button
            onClick={handleAddNewItem}
            className="bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-black px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
          >
            <span>➕</span> Add New Menu Item
          </button>
        </div>

        {/* Menu Items Table / Cards Grid */}
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

              {/* Price & Image Quick Controls */}
              <div className="space-y-3 pt-3 border-t border-fitcat-gold/20">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-fitcat-gold">Price (₹)</label>
                  <div className="flex items-center gap-1">
                    <span className="text-fitcat-gold font-bold text-sm">₹</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      className="w-20 bg-fitcat-green border border-fitcat-gold/50 rounded-lg p-1.5 text-center text-sm font-bold text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setEditingItem(item)}
                  className="w-full bg-fitcat-gold/20 hover:bg-fitcat-gold text-fitcat-gold hover:text-fitcat-darkgreen font-bold py-2 rounded-xl border border-fitcat-gold text-xs transition"
                >
                  ✏️ Edit Full Item Details & Image
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-fitcat-darkgreen border-2 border-fitcat-gold rounded-2xl p-6 max-w-lg w-full text-fitcat-cream shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-fitcat-gold/30 pb-3">
              <h3 className="text-lg font-black text-fitcat-gold">Edit Menu Item</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-fitcat-gold hover:text-white font-bold text-sm"
              >
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
                <label className="block text-xs font-bold text-fitcat-gold mb-1">Food Image URL / Path</label>
                <input
                  type="text"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full bg-fitcat-green border border-fitcat-gold/40 rounded-lg p-2 text-sm text-fitcat-cream"
                />
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
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-fitcat-gold text-fitcat-darkgreen text-xs font-black"
                >
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
