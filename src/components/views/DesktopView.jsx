"use client";

import { useState, useEffect } from "react";
import Logo from "../Logo";
import MapSection from "../MapSection";
import PreOrderModal from "../PreOrderModal";
import FoodCard from "../FoodCard";
import BannerCarousel from "../BannerCarousel";
import WhatsAppIcon from "../WhatsAppIcon";
import InstagramIcon from "../InstagramIcon";
import { subscribeToMenuItems } from "@/lib/menu";
import { FaLocationDot, FaLeaf, FaBolt, FaHeart, FaUserTie, FaPhone, FaCalendarDays, FaClock } from "react-icons/fa6";
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
    <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] font-sans selection:bg-[#05c92f]/20">
      {/* Desktop Top Announcement Bar */}
      <div className="bg-[#162118] text-[#E5C158] px-6 py-2 text-xs font-semibold flex items-center justify-between border-b border-[#263629]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 bg-[#0a140c] px-2.5 py-0.5 rounded-full text-[#FAF9F5] border border-[#263629]">
            <span className="w-2 h-2 rounded-full bg-[#05c92f] animate-pulse"></span>
            Store Timings: 7:00 AM to 9:30 AM Daily
          </span>
          <span className="flex items-center gap-1.5"><FaLocationDot className="text-[#05c92f]" /> Vikhroli East Railway Station, Mumbai</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://api.whatsapp.com/send?phone=917977034609"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[#25D366] hover:underline font-bold"
          >
            <WhatsAppIcon className="w-4 h-4" color="#25D366" />
            <span>+91 7977034609</span>
          </a>
          <span className="text-[#263629]">•</span>
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
      <header className="sticky top-0 z-40 bg-[#0f120f]/95 backdrop-blur-md border-b border-[#263629] px-8 py-3 flex items-center justify-between shadow-lg text-[#FAF9F5]">
        <div className="flex items-center gap-3">
          <Logo className="h-20 lg:h-24 w-auto" />
        </div>

        <nav className="flex items-center gap-8 text-sm font-bold tracking-wide">
          <a href="#hero" className="hover:text-[#E5C158] transition">Home</a>
          <a href="#menu" className="hover:text-[#E5C158] transition">Menu & Prices</a>
          <a href="#preorder" className="hover:text-[#E5C158] transition">WhatsApp Pre-Order</a>
          <a href="#about" className="hover:text-[#E5C158] transition">About Us</a>
          <a href="#location" className="hover:text-[#E5C158] transition">Store Map</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handlePreOrder()}
            className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-bold px-6 py-2.5 rounded-xl shadow-lg transition transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            <WhatsAppIcon className="w-5 h-5" color="#0f110f" />
            <span>Pre-Book Tomorrow's Meal</span>
          </button>
        </div>
      </header>

      {/* Desktop Hero Section */}
      <section id="hero" className="relative px-8 py-16 max-w-5xl mx-auto text-center flex flex-col items-center justify-center space-y-6">
        <div className="inline-block bg-[#0e2413] border border-[#1b4224] text-[#05c92f] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Eat Clean. Feel Great.
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-[#FAF9F5] leading-tight">
          FUEL YOUR DAY <br />
          <span className="text-[#05c92f] italic font-serif text-6xl lg:text-7xl">The Healthy Way</span>
        </h1>
        <p className="text-[#9A978F] text-lg leading-relaxed max-w-2xl mx-auto">
          Fresh, natural, and nourishing sugar-free breakfast bowls, sandwiches, and superfood chia puddings. Made fresh daily at Vikhroli East Railway Station.
        </p>

        {/* 4 Value Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 w-full max-w-4xl">
          <div className="flex items-center gap-3 bg-[#162118] p-4 rounded-xl border border-[#263629] text-left">
            <FaLeaf className="text-2xl text-[#05c92f] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-[#FAF9F5]">MADE FRESH DAILY</h4>
              <p className="text-[11px] text-[#9A978F]">Prepared every morning</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#162118] p-4 rounded-xl border border-[#263629] text-left">
            <FaBolt className="text-2xl text-[#E5C158] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-[#E5C158]">SUGAR FREE</h4>
              <p className="text-[11px] text-[#9A978F]">Natural fiber & energy</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#162118] p-4 rounded-xl border border-[#263629] text-left">
            <MdOutlineEnergySavingsLeaf className="text-2xl text-[#05c92f] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-[#FAF9F5]">CLEAN INGREDIENTS</h4>
              <p className="text-[11px] text-[#9A978F]">Whole grains & fruits</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[#162118] p-4 rounded-xl border border-[#263629] text-left">
            <FaHeart className="text-2xl text-[#E5C158] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-[#E5C158]">FEEL GOOD INSIDE</h4>
              <p className="text-[11px] text-[#9A978F]">Good Food = Good Mood</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePreOrder()}
            className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-bold px-8 py-4 rounded-xl text-base shadow-xl transition transform hover:scale-105 flex items-center gap-2.5"
          >
            <WhatsAppIcon className="w-6 h-6" color="#0f110f" />
            <span>Pre-Order via WhatsApp Now</span>
          </button>
          <a
            href="#location"
            className="border-2 border-[#263629] hover:border-[#E5C158] text-[#FAF9F5] hover:text-[#E5C158] font-bold px-6 py-3.5 rounded-xl transition flex items-center gap-2"
          >
            <FaLocationDot className="text-[#05c92f]" />
            <span>Station Location & Timings</span>
          </a>
        </div>
      </section>

      {/* Desktop Menu Grid Section */}
      <section id="menu" className="px-8 py-16 bg-[#0a140c] border-t border-b border-[#263629]">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Scrollable Promotional Banner Showcase */}
          <div className="max-w-4xl mx-auto">
            <BannerCarousel />
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-[#E5C158] tracking-wider uppercase">FITCAT MENU</h2>
            <p className="text-[#9A978F] text-sm mt-2">
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
          <h2 className="text-3xl font-bold text-[#E5C158] tracking-wider uppercase">FIND US AT VIKHROLI EAST</h2>
          <p className="text-[#9A978F] text-sm mt-2">
            Right outside Vikhroli East Railway Station. Open daily from 6:30 AM to 9:30 AM.
          </p>
        </div>

        <MapSection />
      </section>

      {/* Desktop About Section */}
      <section id="about" className="px-8 py-16 bg-[#162118] border-t border-[#263629]">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-center">
          <div className="col-span-5">
            <div className="border-4 border-[#263629] rounded-2xl overflow-hidden shadow-2xl">
              <img src="/images/business_card.jpeg" alt="Fitcat Founder Business Card" className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="col-span-7 space-y-4">
            <span className="text-xs font-bold text-[#05c92f] uppercase tracking-widest">Our Story & Mission</span>
            <h2 className="text-3xl font-bold text-[#E5C158]">About Fitcat Mumbai</h2>
            <p className="text-[#9A978F] text-sm leading-relaxed">
              Founded by <strong className="text-[#FAF9F5]">Harsh Karangutkar</strong>, Fitcat was built on a simple belief: fast morning food doesn't have to be oily or unhealthy. We provide clean, nutrient-dense breakfast options for daily commuters and fitness enthusiasts at Vikhroli East Station.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
              <div className="bg-[#0a140c] p-3 rounded-lg border border-[#263629]">
                <span className="font-bold text-[#E5C158] flex items-center gap-1.5 mb-0.5"><FaUserTie className="text-[#E5C158]" /> Founder</span>
                <span>Harsh Karangutkar</span>
              </div>
              <div className="bg-[#0a140c] p-3 rounded-lg border border-[#263629]">
                <span className="font-bold text-[#E5C158] block">📱 Instagram</span>
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
      <footer className="bg-[#0f120f] border-t border-[#263629] py-8 px-8 text-center text-xs text-[#9A978F]">
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
