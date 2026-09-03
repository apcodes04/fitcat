"use client";

import { useState } from "react";
import Logo from "../Logo";
import MapSection from "../MapSection";
import PreOrderModal from "../PreOrderModal";

const MENU_ITEMS = [
  { id: "pb-sandwich", name: "PB & Banana Sandwich", price: 50, badge: "Protein Rich", description: "Creamy peanut butter & fresh banana slices on whole grain." },
  { id: "chia-pudding", name: "Superfood Chia Pudding", price: 55, badge: "Energy Boost", description: "Velvety, nutrient-rich with natural sweetness." },
  { id: "rice-cakes", name: "Crispy Rice Cakes", price: 50, badge: "Light Crunch", description: "Airy, crisp, satisfying morning snack." },
  { id: "oats", name: "Whole Grain Oats", price: 65, badge: "Hearty Fiber", description: "Warm bowl of fiber-rich oats simmered to perfection." },
  { id: "muesli", name: "Toasted Muesli", price: 70, badge: "Nutty Crunch", description: "Toasted oats, premium nuts & vibrant dried fruits." },
  { id: "fruit-bowl", name: "Fresh Fruit Bowl", price: 50, badge: "100% Fresh", description: "Refreshing medley of freshly chopped morning fruits." },
];

export default function MobileView({ onToggleView, currentViewMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePreOrder = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-fitcat-green text-fitcat-cream font-sans pb-24">
      {/* Mobile Top Bar */}
      <div className="bg-fitcat-darkgreen px-4 py-2 border-b border-fitcat-gold/20 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-fitcat-gold font-bold">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          6:30 AM – 9:30 AM
        </span>
        <button
          onClick={() => onToggleView(currentViewMode === "mobile" ? "desktop" : "mobile")}
          className="bg-fitcat-gold/20 text-fitcat-gold px-2.5 py-0.5 rounded text-[11px] font-semibold"
        >
          📱 Mobile View (Switch)
        </button>
      </div>

      {/* Mobile Sticky Header */}
      <header className="sticky top-0 z-40 bg-fitcat-green/95 backdrop-blur-md px-4 py-3 border-b border-fitcat-gold/30 flex items-center justify-between shadow-md">
        <Logo className="h-10 w-auto" />
        <button
          onClick={() => handlePreOrder()}
          className="bg-fitcat-gold text-fitcat-darkgreen font-black text-xs px-3.5 py-2 rounded-lg shadow flex items-center gap-1"
        >
          <span>💬</span> Pre-Book
        </button>
      </header>

      {/* Mobile Hero Banner */}
      <section className="p-4">
        <div className="bg-gradient-to-br from-fitcat-darkgreen to-fitcat-green p-5 rounded-2xl border-2 border-fitcat-gold/40 shadow-xl space-y-3">
          <div className="inline-block bg-fitcat-gold/20 text-fitcat-gold px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Eat Clean. Feel Great.
          </div>
          <h1 className="text-2xl font-black leading-tight">
            FUEL YOUR DAY <br />
            <span className="text-fitcat-gold font-serif italic text-3xl">The Healthy Way</span>
          </h1>
          <p className="text-xs text-fitcat-cream/80 leading-relaxed">
            Fresh, natural breakfast at Vikhroli East Railway Station. Open daily from 6:30 AM to 9:30 AM.
          </p>

          <button
            onClick={() => handlePreOrder()}
            className="w-full mt-2 bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-black py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
          >
            <span>📲</span> Pre-Order via WhatsApp Now
          </button>
        </div>
      </section>

      {/* Mobile Quick Food List */}
      <section className="px-4 py-2 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-fitcat-gold">FITCAT MENU</h2>
          <span className="text-xs text-fitcat-cream/70">6 Fresh Options</span>
        </div>

        <div className="space-y-3">
          {MENU_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-fitcat-darkgreen/80 p-4 rounded-xl border border-fitcat-gold/30 shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-extrabold text-fitcat-gold uppercase tracking-wider">{item.badge}</span>
                  <span className="text-base font-black text-fitcat-gold bg-fitcat-green px-2 py-0.5 rounded border border-fitcat-gold/30">
                    ₹{item.price}
                  </span>
                </div>
                <h3 className="text-base font-bold text-fitcat-cream">{item.name}</h3>
                <p className="text-xs text-fitcat-cream/70 mt-1 leading-snug">{item.description}</p>
              </div>

              <button
                onClick={() => handlePreOrder(item)}
                className="mt-3 w-full bg-fitcat-gold/20 hover:bg-fitcat-gold text-fitcat-gold hover:text-fitcat-darkgreen font-bold py-2 rounded-lg border border-fitcat-gold text-xs transition flex items-center justify-center gap-1"
              >
                <span>💬</span> Pre-Book for ₹{item.price}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Map Section */}
      <section className="p-4">
        <h2 className="text-lg font-black text-fitcat-gold mb-3">📍 STORE LOCATION</h2>
        <MapSection />
      </section>

      {/* Mobile About */}
      <section className="p-4 bg-fitcat-darkgreen/60 border-t border-fitcat-gold/20 space-y-2">
        <h3 className="text-base font-black text-fitcat-gold">About Fitcat</h3>
        <p className="text-xs text-fitcat-cream/80 leading-relaxed">
          Founded by <strong>Harsh Karangutkar</strong>. Serving clean, nutritious morning power food right outside Vikhroli East Railway Station, Mumbai.
        </p>
        <div className="text-xs text-fitcat-gold font-semibold pt-1">
          Instagram: <a href="https://instagram.com/fitcatmumbai" target="_blank" rel="noreferrer" className="underline">@fitcatmumbai</a>
        </div>
      </section>

      {/* Mobile Bottom Fixed Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-fitcat-darkgreen border-t border-fitcat-gold/30 px-6 py-2 flex items-center justify-between text-center text-xs">
        <a href="#hero" className="flex flex-col items-center text-fitcat-cream">
          <span className="text-base">🏠</span>
          <span className="text-[10px]">Home</span>
        </a>
        <a href="#menu" className="flex flex-col items-center text-fitcat-cream">
          <span className="text-base">🍽️</span>
          <span className="text-[10px]">Menu</span>
        </a>
        <button onClick={() => handlePreOrder()} className="flex flex-col items-center text-fitcat-gold font-bold scale-110">
          <span className="text-lg">💬</span>
          <span className="text-[10px]">Pre-Book</span>
        </button>
        <a href="#location" className="flex flex-col items-center text-fitcat-cream">
          <span className="text-base">📍</span>
          <span className="text-[10px]">Map</span>
        </a>
        <a href="/admin" className="flex flex-col items-center text-fitcat-cream">
          <span className="text-base">🔒</span>
          <span className="text-[10px]">Admin</span>
        </a>
      </nav>

      {/* Pre-Order Modal */}
      <PreOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialItem={selectedItem} />
    </div>
  );
}
