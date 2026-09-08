"use client";

import { useState, useEffect } from "react";
import { subscribeToBanners } from "@/lib/banners";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function BannerCarousel({ className = "", onPreOrder = null }) {
  const [banners, setBanners] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToBanners((liveBanners) => {
      setBanners(liveBanners);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Auto-play slides every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[activeIdx];

  const handleNext = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleCardClick = () => {
    if (typeof onPreOrder === "function") {
      onPreOrder();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`relative w-full overflow-hidden rounded-2xl border-2 border-[#263629] bg-[#162118] shadow-xl group cursor-pointer transition transform hover:scale-[1.002] ${className}`}
    >
      {/* Menu Card Poster Image Container (Adjusts dynamically for any image resolution & ratio) */}
      <div className="relative w-full h-64 sm:h-84 md:h-[420px] bg-[#0a140c] flex items-center justify-center p-1 sm:p-2">
        <img
          src={currentBanner.image}
          alt={currentBanner.title || "FitCat Menu Card"}
          className="w-full h-full object-contain rounded-xl transition-all duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/menu_poster.jpeg";
          }}
        />

        {/* Clean Title Bar Below Image (No WhatsApp / Badges / Overlays) */}
        {currentBanner.title && currentBanner.title.trim() !== "" && (
          <div className="absolute bottom-2 inset-x-2 text-center bg-[#162118]/95 backdrop-blur-md py-1.5 px-3 rounded-xl border border-[#263629] pointer-events-none">
            <h3 className="text-xs sm:text-sm font-bold text-[#FAF9F5] truncate">
              {currentBanner.title}
            </h3>
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-[#E5C158] p-2 sm:p-2.5 rounded-full backdrop-blur-sm transition active:scale-95 z-10 border border-[#263629]"
              title="Previous Image"
            >
              <FaChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-[#E5C158] p-2 sm:p-2.5 rounded-full backdrop-blur-sm transition active:scale-95 z-10 border border-[#263629]"
              title="Next Image"
            >
              <FaChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Carousel Indicator Dots */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-sm z-10 border border-[#263629]">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIdx ? "bg-[#05c92f] w-4" : "bg-white/50 w-1.5"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
