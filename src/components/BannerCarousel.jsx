"use client";

import { useState, useEffect } from "react";
import { subscribeToBanners } from "@/lib/banners";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import WhatsAppIcon from "./WhatsAppIcon";

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
      className={`relative w-full overflow-hidden rounded-2xl border-2 border-[#263629] bg-[#162118] shadow-xl group cursor-pointer transition transform hover:scale-[1.005] ${className}`}
    >
      <div className="relative w-full h-60 sm:h-80 md:h-96 bg-[#0a140c] flex items-center justify-center p-1">
        <img
          src={currentBanner.image}
          alt={currentBanner.title || "Fitcat Menu & Poster Banner"}
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
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 bg-[#162118]/90 backdrop-blur-md p-3 rounded-xl border border-[#263629]">
            <div className="text-left min-w-0">
              {currentBanner.subtitle && (
                <p className="text-[10px] sm:text-xs font-bold text-[#E5C158] uppercase tracking-wider truncate">
                  {currentBanner.subtitle}
                </p>
              )}
              {currentBanner.title && (
                <h3 className="text-xs sm:text-sm font-black text-[#FAF9F5] mt-0.5 truncate">
                  {currentBanner.title}
                </h3>
              )}
            </div>

            {onPreOrder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreOrder();
                }}
                className="bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-bold text-[11px] px-3 py-1.5 rounded-full shadow flex items-center gap-1 flex-shrink-0 transition active:scale-95"
              >
                <WhatsAppIcon className="w-3 h-3" color="#0f110f" />
                <span>Pre-Book</span>
              </button>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIdx(idx);
                  }}
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
