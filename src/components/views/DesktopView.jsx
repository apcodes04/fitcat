"use client";

import { useState, useEffect } from "react";
import Logo from "../Logo";
import MapSection from "../MapSection";
import PreOrderModal from "../PreOrderModal";
import FoodCard from "../FoodCard";
import WhatsAppIcon from "../WhatsAppIcon";
import InstagramIcon from "../InstagramIcon";
import { subscribeToMenuItems } from "@/lib/menu";
import { FaLocationDot, FaLeaf, FaBolt, FaHeart, FaUserTie } from "react-icons/fa6";
import { MdOutlineEnergySavingsLeaf } from "react-icons/md";

export default function DesktopView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToMenuItems((liveItems) => {
      setMenuItems(liveItems);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

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
            Store Timings: 6:30 AM to 9:30 AM Daily
          </span>
          <span className="flex items-center gap-1.5"><FaLocationDot className="text-fitcat-gold" /> Vikhroli East Railway Station, Mumbai</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://wa.me/917977034609"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#25D366] hover:underline font-bold"
          >
            <WhatsAppIcon className="w-4 h-4" color="#25D366" />
            <span>+91 7977034609</span>
          </a>
          <span className="text-fitcat-gold/40">•</span>
          <a
            href="https://instagram.com/fitcatmumbai"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#E1306C] hover:underline font-bold"
          >
            <InstagramIcon className="w-4 h-4" color="#E1306C" />
            <span>@fitcatmumbai</span>
          </a>
        </div>
      </div>

      {/* Desktop Header Navigation */}
      <header className="sticky top-0 z-40 bg-fitcat-green/95 backdrop-blur-md border-b border-fitcat-gold/30 px-8 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <Logo className="h-20 lg:h-24 w-auto" />
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
            className="bg-green-600 hover:bg-green-500 text-white font-black px-6 py-2.5 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <WhatsAppIcon className="w-5 h-5 fill-white" />
            <span>Pre-Book Tomorrow's Meal</span>
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
              <FaLeaf className="text-2xl text-fitcat-gold flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">MADE FRESH DAILY</h4>
                <p className="text-xs text-fitcat-cream/70">Simmered & prepared every morning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-fitcat-darkgreen/60 p-3 rounded-xl border border-fitcat-gold/20">
              <FaBolt className="text-2xl text-fitcat-gold flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">SUGAR FREE</h4>
                <p className="text-xs text-fitcat-cream/70">100% natural fiber & energy</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-fitcat-darkgreen/60 p-3 rounded-xl border border-fitcat-gold/20">
              <MdOutlineEnergySavingsLeaf className="text-2xl text-fitcat-gold flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">CLEAN INGREDIENTS</h4>
                <p className="text-xs text-fitcat-cream/70">100% wholesome whole grains & fruits</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-fitcat-darkgreen/60 p-3 rounded-xl border border-fitcat-gold/20">
              <FaHeart className="text-2xl text-fitcat-gold flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-fitcat-gold">FEEL GOOD INSIDE OUT</h4>
                <p className="text-xs text-fitcat-cream/70">Good Food = Good Mood</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              onClick={() => handlePreOrder()}
              className="bg-green-600 hover:bg-green-500 text-white font-black px-8 py-4 rounded-xl text-base shadow-xl transition transform hover:scale-105 flex items-center gap-2.5"
            >
              <WhatsAppIcon className="w-6 h-6" color="#ffffff" />
              <span>Pre-Order via WhatsApp Now</span>
            </button>
            <a
              href="#location"
              className="border-2 border-fitcat-cream/40 hover:border-fitcat-gold text-fitcat-cream hover:text-fitcat-gold font-bold px-6 py-3.5 rounded-xl transition flex items-center gap-2"
            >
              <FaLocationDot className="text-fitcat-gold" />
              <span>Station Location & Timings</span>
            </a>
          </div>
        </div>

        {/* Hero Poster Showcase */}
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

      {/* Desktop Menu Section */}
      <section id="menu" className="px-8 py-16 bg-fitcat-darkgreen/80 border-t border-b border-fitcat-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-fitcat-gold tracking-wider uppercase">FITCAT MENU</h2>
            <p className="text-fitcat-cream/80 text-sm mt-2">
              Freshly prepared healthy breakfasts served daily from 6:30 AM to 9:30 AM at Vikhroli East Station.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, index) => (
              <FoodCard
                key={item.id}
                item={item}
                index={index}
                onPreOrder={handlePreOrder}
                variant="desktop"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Desktop Map & Location Section */}
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
                <span className="font-bold text-fitcat-gold flex items-center gap-1.5 mb-0.5"><FaUserTie className="text-fitcat-gold" /> Founder</span>
                <span>Harsh Karangutkar</span>
              </div>
              <div className="bg-fitcat-green p-3 rounded-lg border border-fitcat-gold/30">
                <span className="font-bold text-fitcat-gold block">📱 Instagram</span>
                <a href="https://instagram.com/fitcatmumbai" target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1.5 mt-0.5 font-bold text-[#E1306C]">
                  <InstagramIcon className="w-3.5 h-3.5" color="#E1306C" />
                  <span>@fitcatmumbai</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Footer */}
      <footer className="bg-fitcat-darkgreen border-t border-fitcat-gold/30 py-8 px-8 text-center text-xs text-fitcat-cream/70">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo className="h-16 w-auto" />
          <p>© {new Date().getFullYear()} Fitcat (fitcat.in). All rights reserved. Vikhroli East, Mumbai.</p>
          <div className="flex gap-6 items-center">
            <a href="https://wa.me/917977034609" target="_blank" rel="noreferrer" className="hover:text-green-300 text-[#25D366] flex items-center gap-1.5 font-bold">
              <WhatsAppIcon className="w-4 h-4" color="#25D366" /> WhatsApp
            </a>
            <a href="https://instagram.com/fitcatmumbai" target="_blank" rel="noreferrer" className="hover:text-pink-300 text-[#E1306C] flex items-center gap-1.5 font-bold">
              <InstagramIcon className="w-4 h-4" color="#E1306C" /> Instagram
            </a>
          </div>
        </div>
      </footer>

      {/* Pre-Order Modal */}
      <PreOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialItem={selectedItem} />
    </div>
  );
}
