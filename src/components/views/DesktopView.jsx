"use client";

import { useState } from "react";
import Logo from "../Logo";
import MapSection from "../MapSection";
import PreOrderModal from "../PreOrderModal";

const MENU_ITEMS = [
  {
    id: "pb-sandwich",
    name: "Peanut Butter Banana Sandwich",
    price: 50,
    badge: "Protein Rich & Fiber-full",
    description: "Creamy peanut butter and fresh, sweet banana slices layered for a classic, protein-packed energy boost.",
    image: "/images/menu_poster.jpeg",
  },
  {
    id: "chia-pudding",
    name: "Superfood Chia Pudding",
    price: 55,
    badge: "Energy Boost",
    description: "A velvety, nutrient-rich delight with a perfectly creamy texture and a hint of natural sweetness.",
    image: "/images/hero_poster.jpeg",
  },
  {
    id: "rice-cakes",
    name: "Crispy Rice Cakes",
    price: 50,
    badge: "Light & Airy Crunch",
    description: "Light, airy, and crisp—the perfect satisfying crunch to keep you fueled and focused.",
    image: "/images/menu_poster.jpeg",
  },
  {
    id: "oats",
    name: "Whole Grain Oats",
    price: 65,
    badge: "Hearty Fiber",
    description: "A warm, comforting bowl of whole-grain oats, rich in fiber and simmered to a perfect, hearty texture.",
    image: "/images/hero_poster.jpeg",
  },
  {
    id: "muesli",
    name: "Toasted Nut Muesli",
    price: 70,
    badge: "Wholesome Crunch",
    description: "A wholesome, satisfying crunch of toasted oats, premium nuts, and vibrant dried fruits.",
    image: "/images/menu_poster.jpeg",
  },
  {
    id: "fruit-bowl",
    name: "Fresh Fruit Bowl",
    price: 50,
    badge: "100% Natural Sweetness",
    description: "A vibrant, refreshing medley of freshly chopped fruits bursting with natural sweetness.",
    image: "/images/hero_poster.jpeg",
  },
];

export default function DesktopView({ onToggleView, currentViewMode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handlePreOrder = (item = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-fitcat-green text-fitcat-cream font-sans">
      {/* Desktop Top Announcement Bar */}
      <div className="bg-fitcat-darkgreen text-fitcat-gold px-6 py-2 text-xs font-semibold flex items-center justify-between border-b border-fitcat-gold/20">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 bg-fitcat-gold/20 px-2.5 py-0.5 rounded-full text-fitcat-cream">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Store Timings: 6:30 AM – 9:30 AM Daily
          </span>
          <span>📍 Vikhroli East Railway Station, Mumbai</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleView(currentViewMode === "desktop" ? "mobile" : "desktop")}
            className="bg-fitcat-gold/20 hover:bg-fitcat-gold/40 text-fitcat-gold px-3 py-1 rounded text-xs transition"
          >
            🖥️ Desktop View Mode (Click to Switch to Mobile File View)
          </button>
          <a href="/admin" className="hover:underline text-fitcat-cream">🔒 Admin Dashboard</a>
        </div>
      </div>

      {/* Desktop Header Navigation */}
      <header className="sticky top-0 z-40 bg-fitcat-green/95 backdrop-blur-md border-b border-fitcat-gold/30 px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Logo className="h-14 w-auto" />
        </div>

        <nav className="flex items-center gap-8 text-sm font-bold tracking-wide">
          <a href="#hero" className="hover:text-fitcat-gold transition">Home</a>
          <a href="#menu" className="hover:text-fitcat-gold transition">Menu & Prices</a>
          <a href="#preorder" className="hover:text-fitcat-gold transition">WhatsApp Pre-Order</a>
          <a href="#about" className="hover:text-fitcat-gold transition">About Us</a>
          <a href="#location" className="hover:text-fitcat-gold transition">Store Map</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePreOrder()}
            className="bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-black px-6 py-2.5 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <span>💬</span> Pre-Book Tomorrow's Meal
          </button>
        </div>
      </header>

      {/* Desktop Hero Section */}
      <section id="hero" className="relative px-8 py-16 max-w-7xl mx-auto grid grid-cols-12 gap-8 items-center">
        <div className="col-span-7 space-y-6">
          <div className="inline-block bg-fitcat-gold/20 border border-fitcat-gold text-fitcat-gold px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
            Eat Clean. Feel Great.
          </div>
          <h1 className="text-5xl font-black text-fitcat-cream leading-tight">
            FUEL YOUR DAY <br />
            <span className="text-fitcat-gold italic font-serif text-6xl">The Healthy Way</span>
          </h1>
          <p className="text-fitcat-cream/90 text-lg leading-relaxed max-w-xl">
            Fresh, natural, and nourishing power breakfast bowls, sandwiches, and superfood chia puddings. Made fresh daily at Vikhroli East Railway Station.
          </p>

          {/* 4 Value Badges */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-3 bg-fitcat-darkgreen/60 p-3 rounded-xl border border-fitcat-gold/20">
              <span className="text-2xl">🌱</span>
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">MADE FRESH DAILY</h4>
                <p className="text-xs text-fitcat-cream/70">Simmered & prepared every morning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-fitcat-darkgreen/60 p-3 rounded-xl border border-fitcat-gold/20">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">RICH IN NUTRIENTS</h4>
                <p className="text-xs text-fitcat-cream/70">High protein & fiber for morning energy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-fitcat-darkgreen/60 p-3 rounded-xl border border-fitcat-gold/20">
              <span className="text-2xl">🥗</span>
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">CLEAN INGREDIENTS</h4>
                <p className="text-xs text-fitcat-cream/70">100% wholesome whole grains & fruits</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-fitcat-darkgreen/60 p-3 rounded-xl border border-fitcat-gold/20">
              <span className="text-2xl">💚</span>
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">FEEL GOOD INSIDE OUT</h4>
                <p className="text-xs text-fitcat-cream/70">Good Food = Good Mood</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => handlePreOrder()}
              className="bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-black px-8 py-4 rounded-xl text-base shadow-xl transition transform hover:scale-105 flex items-center gap-2"
            >
              <span>📲</span> Pre-Order via WhatsApp Now
            </button>
            <a
              href="#location"
              className="border-2 border-fitcat-cream/40 hover:border-fitcat-gold text-fitcat-cream hover:text-fitcat-gold font-bold px-6 py-3.5 rounded-xl transition"
            >
              📍 Station Location & Timings
            </a>
          </div>
        </div>

        {/* Hero Poster Image Showcase */}
        <div className="col-span-5 relative">
          <div className="relative rounded-2xl overflow-hidden border-4 border-fitcat-gold shadow-2xl group">
            <img
              src="/images/hero_poster.jpeg"
              alt="Fitcat Healthy Breakfast Menu Poster"
              className="w-full h-[480px] object-cover transition transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-fitcat-darkgreen via-transparent to-transparent opacity-80"></div>
            <div className="absolute bottom-4 left-4 right-4 text-center bg-fitcat-green/90 backdrop-blur-md p-3 rounded-xl border border-fitcat-gold/40">
              <p className="text-xs font-bold text-fitcat-gold uppercase tracking-wider">Fitcat Daily Special</p>
              <h3 className="text-lg font-black text-fitcat-cream">Good Food • Good Mood</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Menu Grid Section */}
      <section id="menu" className="px-8 py-16 bg-fitcat-darkgreen/80 border-t border-b border-fitcat-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-fitcat-gold tracking-wider uppercase">FITCAT MENU</h2>
            <p className="text-fitcat-cream/80 text-sm mt-2">
              Freshly prepared healthy breakfasts served daily from 6:30 AM to 9:30 AM at Vikhroli East Station.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {MENU_ITEMS.map((item) => (
              <div
                key={item.id}
                className="bg-fitcat-green rounded-2xl border-2 border-fitcat-gold/30 hover:border-fitcat-gold shadow-xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-fitcat-gold/20 text-fitcat-gold text-xs font-extrabold px-3 py-1 rounded-full border border-fitcat-gold/40">
                      {item.badge}
                    </span>
                    <span className="text-2xl font-black text-fitcat-gold bg-fitcat-darkgreen px-3 py-1 rounded-lg border border-fitcat-gold/30">
                      ₹{item.price}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-fitcat-cream mb-2">{item.name}</h3>
                  <p className="text-xs text-fitcat-cream/80 leading-relaxed mb-4">{item.description}</p>
                </div>

                <button
                  onClick={() => handlePreOrder(item)}
                  className="w-full mt-4 bg-fitcat-gold/20 hover:bg-fitcat-gold text-fitcat-gold hover:text-fitcat-darkgreen font-black py-2.5 px-4 rounded-xl border border-fitcat-gold transition flex items-center justify-center gap-2 text-sm"
                >
                  <span>📲</span> Pre-Book for ₹{item.price}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop Map & Location Section with Logo Overlay */}
      <section id="location" className="px-8 py-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-black text-fitcat-gold tracking-wider uppercase">FIND US AT VIKHROLI EAST</h2>
          <p className="text-fitcat-cream/80 text-sm mt-2">
            Right outside Vikhroli East Railway Station. Open daily from 6:30 AM to 9:30 AM.
          </p>
        </div>

        <MapSection />
      </section>

      {/* Desktop About Section */}
      <section id="about" className="px-8 py-16 bg-fitcat-darkgreen/60 border-t border-fitcat-gold/20">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-center">
          <div className="col-span-5">
            <div className="border-4 border-fitcat-gold rounded-2xl overflow-hidden shadow-2xl">
              <img src="/images/business_card.jpeg" alt="Fitcat Founder Business Card" className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="col-span-7 space-y-4">
            <span className="text-xs font-bold text-fitcat-gold uppercase tracking-widest">Our Story & Mission</span>
            <h2 className="text-3xl font-black text-fitcat-cream">About Fitcat Mumbai</h2>
            <p className="text-fitcat-cream/90 text-sm leading-relaxed">
              Founded by <strong>Harsh Karangutkar</strong>, Fitcat was built on a simple belief: fast morning food doesn't have to be oily or unhealthy. We provide clean, nutrient-dense breakfast options for daily commuters and fitness enthusiasts at Vikhroli East Station.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-fitcat-green p-3 rounded-lg border border-fitcat-gold/30">
                <span className="font-bold text-fitcat-gold block">👨‍🍳 Founder</span>
                <span>Harsh Karangutkar</span>
              </div>
              <div className="bg-fitcat-green p-3 rounded-lg border border-fitcat-gold/30">
                <span className="font-bold text-fitcat-gold block">📱 Instagram</span>
                <a href="https://instagram.com/fitcatmumbai" target="_blank" rel="noreferrer" className="hover:underline">@fitcatmumbai</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Footer */}
      <footer className="bg-fitcat-darkgreen border-t border-fitcat-gold/30 py-8 px-8 text-center text-xs text-fitcat-cream/70">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo className="h-10 w-auto" />
          <p>© {new Date().getFullYear()} Fitcat (fitcat.in). All rights reserved. Vikhroli East, Mumbai.</p>
          <div className="flex gap-4">
            <a href="/admin" className="hover:text-fitcat-gold">Admin Panel</a>
            <a href="https://instagram.com/fitcatmumbai" target="_blank" rel="noreferrer" className="hover:text-fitcat-gold">Instagram</a>
          </div>
        </div>
      </footer>

      {/* Pre-Order Modal */}
      <PreOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialItem={selectedItem} />
    </div>
  );
}
