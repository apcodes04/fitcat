"use client";

import { useState, useEffect } from "react";
import { subscribeToBanners } from "@/lib/banners";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function BannerCarousel({ className = "" }) {
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

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border-2 border-[#263629] bg-[#162118] shadow-xl group ${className}`}>
      <div className="relative w-full h-56 sm:h-72 md:h-80 bg-[#0a140c] flex items-center justify-center">
        <img
          src={currentBanner.image}
          alt={currentBanner.title || "Fitcat Promotional Banner"}
          className="w-full h-full object-contain rounded-xl transition-all duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/menu_poster.jpeg";
          }}
        />

        {/* Subtle Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f120f]/90 via-transparent to-transparent opacity-80 pointer-events-none" />

        {/* Banner Title & Subtitle Badge */}
        {(currentBanner.title || currentBanner.subtitle) && (
          <div className="absolute bottom-3 left-3 right-3 text-center bg-[#162118]/90 backdrop-blur-md p-3 rounded-xl border border-[#263629] pointer-events-none">
            {currentBanner.subtitle && (
              <p className="text-[10px] sm:text-xs font-bold text-[#E5C158] uppercase tracking-wider">
                {currentBanner.subtitle}
              </p>
            )}
            {currentBanner.title && (
              <h3 className="text-sm sm:text-lg font-black text-[#FAF9F5] mt-0.5">
                {currentBanner.title}
              </h3>
            )}
          </div>
        )}

        {/* Carousel Navigation Buttons */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-[#E5C158] p-2 rounded-full backdrop-blur-sm transition active:scale-95 z-10"
              title="Previous Banner"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-[#E5C158] p-2 rounded-full backdrop-blur-sm transition active:scale-95 z-10"
              title="Next Banner"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>

            {/* Carousel Indicator Dots */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeIdx ? "bg-[#E5C158] w-4" : "bg-white/50 w-1.5"
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
