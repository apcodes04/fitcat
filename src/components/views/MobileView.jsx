"use client";

import { useState, useEffect } from "react";
import Logo from "../Logo";
import MapSection from "../MapSection";
import PreOrderModal from "../PreOrderModal";
import FoodCard from "../FoodCard";
import WhatsAppIcon from "../WhatsAppIcon";
import InstagramIcon from "../InstagramIcon";
import { subscribeToMenuItems } from "@/lib/menu";
import { FaLocationDot, FaHouse, FaUtensils, FaLeaf, FaBolt } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";

export default function MobileView() {
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
    <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] font-sans pb-28 selection:bg-[#05c92f]/20 overflow-x-hidden">
      {/* Floating Glass Header Navbar (Fixed Single-Line Alignment on Scroll) */}
      <header className="sticky top-2 z-40 mx-2 sm:mx-4 bg-[#0f120f]/95 backdrop-blur-xl rounded-2xl border border-[#263629] px-3 sm:px-4 py-2 flex items-center justify-between shadow-2xl transition-all duration-200">
        {/* Left: Cropped Brand Logo & Single-Line Timing / Address */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Logo className="h-10 sm:h-11 w-auto flex-shrink-0" cropped={true} />
          <div className="flex flex-col border-l border-[#263629] pl-2 sm:pl-2.5 min-w-0">
            {/* Timing in a SINGLE LINE */}
            <span className="whitespace-nowrap flex items-center gap-1.5 text-[#05c92f] font-bold text-[10px] sm:text-[11px] leading-tight">
              <span className="w-1.5 h-1.5 rounded-full bg-[#05c92f] animate-pulse flex-shrink-0"></span>
              <span>6:30 AM to 9:30 AM</span>
            </span>

            {/* Address in a SINGLE LINE */}
            <span className="whitespace-nowrap flex items-center gap-1 text-[#9A978F] font-medium text-[9px] sm:text-[10px] leading-tight mt-0.5">
              <FaLocationDot className="text-[#9A978F] w-2.5 h-2.5 flex-shrink-0" />
              <span>Vikhroli East Station</span>
            </span>
          </div>
        </div>

        {/* Right: Pre-Book Pill Button & Single-Line Phone / Instagram */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0 pl-1">
          <button
            onClick={() => handlePreOrder()}
            className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-bold text-[11px] px-3 py-1 rounded-full shadow-sm flex items-center gap-1 transition duration-200 active:scale-95 whitespace-nowrap"
          >
            <WhatsAppIcon className="w-3 h-3" color="#0f110f" />
            <span>Pre-Book</span>
          </button>

          {/* Phone Number and Instagram Handle in a SINGLE LINE */}
          <div className="whitespace-nowrap flex items-center gap-1.5 text-[9px] sm:text-[10px] text-[#9A978F] font-bold mt-0.5">
            <a
              href="https://wa.me/917977034609"
              target="_blank"
              rel="noreferrer"
              className="text-[#25D366] hover:underline flex items-center gap-0.5 whitespace-nowrap"
            >
              <WhatsAppIcon className="w-2.5 h-2.5 flex-shrink-0" color="#25D366" />
              <span>+91 7977034609</span>
            </a>
            <span className="text-[#263629]">•</span>
            <a
              href="https://instagram.com/fitcatmumbai"
              target="_blank"
              rel="noreferrer"
              className="text-[#E1306C] hover:underline flex items-center gap-0.5 whitespace-nowrap"
            >
              <InstagramIcon className="w-2.5 h-2.5 flex-shrink-0" color="#E1306C" />
              <span>@fitcatmumbai</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Card Container */}
      <section className="p-4 pt-3" id="hero">
        <div className="relative bg-[#162118] p-6 rounded-[.75rem] border border-[#263629] shadow-sm space-y-5 text-center overflow-hidden flex flex-col items-center">
          {/* Ink-blot Accent Wash */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#05c92f]/10 blur-3xl pointer-events-none"></div>

          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-1.5 bg-[#0e2413] text-[#05c92f] px-3.5 py-1 rounded-full text-[11px] font-medium uppercase tracking-[.12em] border border-[#1b4224]">
            <HiSparkles className="w-3 h-3 text-[#05c92f]" />
            <span>Eat Clean. Feel Great.</span>
          </div>

          {/* Centered Fitcat Brand Logo */}
          <div className="py-2 flex justify-center w-full">
            <Logo className="h-44 sm:h-52 w-auto" />
          </div>

          {/* Headline & Subhead */}
          <div className="space-y-2 relative z-10 max-w-sm mx-auto">
            <h1 className="text-2xl sm:text-3xl font-semibold leading-[1.03] text-[#FAF9F5] tracking-[-.03em] uppercase">
              FUEL YOUR DAY <br />
              <span className="text-[#05c92f] font-serif italic text-3xl sm:text-4xl capitalize">The Healthy Way</span>
            </h1>
            <p className="text-xs text-[#9A978F] leading-[1.625] max-w-xs mx-auto pt-1">
              Fresh, natural morning power breakfasts prepared daily at Vikhroli East Station (6:30 AM to 9:30 AM).
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#9A978F] font-medium">
            <span className="bg-[#0a140c] px-3 py-1 rounded-full border border-[#263629] flex items-center gap-1.5">
              <FaLeaf className="w-3 h-3 text-[#05c92f]" /> 100% Fresh Daily
            </span>
            <span className="bg-[#0a140c] px-3 py-1 rounded-full border border-[#263629] flex items-center gap-1.5">
              <FaBolt className="w-3 h-3 text-[#05c92f]" /> Sugar Free
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => handlePreOrder()}
            className="w-full bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-semibold py-3.5 px-4 rounded-full shadow-sm flex items-center justify-center gap-2.5 text-sm transition duration-200 active:scale-95"
          >
            <WhatsAppIcon className="w-5 h-5" color="#0f110f" />
            <span>Pre-Order via WhatsApp Now</span>
          </button>
        </div>
      </section>

      {/* Food Menu Section */}
      <section className="px-4 py-3 space-y-4" id="menu">
        <div className="flex items-center justify-between border-b border-[#263629] pb-3">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[.12em] text-[#9A978F] block mb-0.5">SELECTION</span>
            <h2 className="text-lg font-semibold text-[#FAF9F5] tracking-[-.03em]">FITCAT MENU</h2>
          </div>
          <span className="text-xs text-[#05c92f] font-medium bg-[#0e2413] px-3 py-1 rounded-full border border-[#1b4224] tabular-nums">
            {menuItems.length} Available
          </span>
        </div>

        {/* Menu Grid using FoodCard */}
        <div className="space-y-4">
          {menuItems.map((item, index) => (
            <FoodCard
              key={item.id}
              item={item}
              index={index}
              onPreOrder={handlePreOrder}
              variant="mobile"
            />
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="p-4" id="location">
        <div className="bg-[#162118] p-5 rounded-[.75rem] border border-[#263629] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#263629] pb-2">
            <span className="text-[11px] font-medium uppercase tracking-[.12em] text-[#9A978F]">OUTLET LOCATION</span>
            <span className="text-xs font-semibold text-[#05c92f] flex items-center gap-1">
              <FaLocationDot className="w-3 h-3 text-[#05c92f]" /> Vikhroli East
            </span>
          </div>
          <MapSection />
        </div>
      </section>

      {/* About Section */}
      <section className="p-4 mx-4 bg-[#162118] rounded-[.75rem] border border-[#263629] space-y-2">
        <span className="text-[11px] font-medium uppercase tracking-[.12em] text-[#9A978F] block">OUR STORY</span>
        <h3 className="text-base font-semibold text-[#FAF9F5]">About Fitcat Mumbai</h3>
        <p className="text-xs text-[#9A978F] leading-[1.625]">
          Founded by <strong>Harsh Karangutkar</strong>. Built to serve clean, nutrient-dense morning power breakfasts for daily commuters at Vikhroli East Railway Station.
        </p>
        <div className="text-xs pt-2 flex items-center gap-2 border-t border-[#263629] mt-3">
          <span className="text-[#9A978F]">Instagram:</span>
          <a
            href="https://instagram.com/fitcatmumbai"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[#E1306C] hover:underline font-medium"
          >
            <InstagramIcon className="w-3.5 h-3.5" color="#E1306C" />
            <span>@fitcatmumbai</span>
          </a>
        </div>
      </section>

      {/* Floating Bottom Navigation Pill */}
      <nav className="fixed bottom-3 left-4 right-4 z-50 bg-[#0f120f]/95 backdrop-blur-xl border border-[#263629] px-6 py-2.5 rounded-full flex items-center justify-around text-center text-xs shadow-xl">
        <a href="#hero" className="flex flex-col items-center text-[#9A978F] hover:text-[#FAF9F5] transition">
          <FaHouse className="text-base mb-0.5 text-[#05c92f]" />
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a href="#menu" className="flex flex-col items-center text-[#9A978F] hover:text-[#FAF9F5] transition">
          <FaUtensils className="text-base mb-0.5" />
          <span className="text-[10px] font-medium">Menu</span>
        </a>
        <button onClick={() => handlePreOrder()} className="flex flex-col items-center text-[#25D366] font-semibold scale-110">
          <WhatsAppIcon className="w-5 h-5" color="#25D366" />
          <span className="text-[10px]">Pre-Book</span>
        </button>
        <a href="#location" className="flex flex-col items-center text-[#9A978F] hover:text-[#FAF9F5] transition">
          <FaLocationDot className="text-base mb-0.5" />
          <span className="text-[10px] font-medium">Map</span>
        </a>
      </nav>

      {/* Pre-Order Modal */}
      <PreOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialItem={selectedItem} />
    </div>
  );
}
