"use client";

import { useState, useEffect } from "react";
import { subscribeToBanners } from "@/lib/banners";
import { FaChevronLeft, FaChevronRight, FaXmark, FaExpand } from "react-icons/fa6";

export default function BannerCarousel({ className = "", onPreOrder = null }) {
  const [banners, setBanners] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  // Touch Swipe Gesture State
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 35;

  useEffect(() => {
    const unsubscribe = subscribeToBanners((liveBanners) => {
      setBanners(liveBanners);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Auto-play slides every 6 seconds (paused if viewing fullscreen)
  useEffect(() => {
    if (banners.length <= 1 || isFullscreenOpen) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length, isFullscreenOpen]);

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[activeIdx];

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Touch Swipe Event Handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const openFullscreen = (e) => {
    if (e) e.stopPropagation();
    setIsFullscreenOpen(true);
  };

  return (
    <>
      {/* Homepage Scrollable / Swipable Banner Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={openFullscreen}
        className={`relative w-full overflow-hidden rounded-2xl border-2 border-[#263629] bg-[#162118] shadow-2xl group cursor-pointer transition transform hover:scale-[1.002] ${className}`}
      >
        {/* Menu Card Poster Container */}
        <div className="relative w-full h-64 sm:h-84 md:h-[430px] bg-[#0a140c] flex items-center justify-center p-1 sm:p-2 select-none">
          <img
            src={currentBanner.image}
            alt={currentBanner.title || "FitCat Menu Card Poster"}
            className="w-full h-full object-contain rounded-xl transition-all duration-300 pointer-events-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/menu_poster.jpeg";
            }}
          />

          {/* Fullscreen Expand Hint Badge */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] sm:text-xs text-[#05c92f] font-bold border border-[#263629] flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition z-10">
            <FaExpand className="w-3 h-3 text-[#05c92f]" />
            <span>Tap for Fullscreen</span>
          </div>

          {/* Clean Title Bar Below Image */}
          {currentBanner.title && currentBanner.title.trim() !== "" && (
            <div className="absolute bottom-2 inset-x-2 text-center bg-[#162118]/95 backdrop-blur-md py-1.5 px-3 rounded-xl border border-[#263629] pointer-events-none">
              <h3 className="text-xs sm:text-sm font-bold text-[#FAF9F5] truncate">
                {currentBanner.title}
              </h3>
            </div>
          )}

          {/* Left / Right Carousel Buttons */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-[#E5C158] p-2.5 rounded-full backdrop-blur-sm transition active:scale-95 z-20 border border-[#263629]"
                title="Previous Poster"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-[#E5C158] p-2.5 rounded-full backdrop-blur-sm transition active:scale-95 z-20 border border-[#263629]"
                title="Next Poster"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 px-3 py-1 rounded-full backdrop-blur-sm z-20 border border-[#263629]">
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

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {isFullscreenOpen && (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-3 sm:p-6 text-[#FAF9F5] animate-in fade-in duration-200"
        >
          {/* Top Bar with Title and Close Button */}
          <div className="w-full max-w-5xl flex items-center justify-between z-20">
            <span className="text-xs sm:text-sm font-bold text-[#05c92f] bg-[#0e2413] px-3 py-1 rounded-full border border-[#1b4224]">
              Poster {activeIdx + 1} of {banners.length}
            </span>
            <button
              onClick={() => setIsFullscreenOpen(false)}
              className="bg-[#162118] hover:bg-red-600 text-white p-2.5 rounded-full border border-[#263629] transition active:scale-95 flex items-center gap-1 text-xs font-bold"
              title="Close Fullscreen"
            >
              <FaXmark className="w-5 h-5" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>

          {/* Main Fullscreen Poster Display */}
          <div className="relative w-full flex-1 max-w-5xl flex items-center justify-center my-2 overflow-hidden select-none">
            <img
              src={currentBanner.image}
              alt={currentBanner.title || "FitCat Fullscreen Menu Card"}
              className="max-h-[85vh] max-w-[95vw] w-auto h-auto object-contain rounded-2xl shadow-2xl transition-all duration-300"
            />

            {/* Navigation Arrows inside Fullscreen Lightbox */}
            {banners.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-[#E5C158] p-3 rounded-full backdrop-blur-md transition active:scale-95 z-30 border border-[#263629]"
                  title="Previous Poster"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-[#E5C158] p-3 rounded-full backdrop-blur-md transition active:scale-95 z-30 border border-[#263629]"
                  title="Next Poster"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Title Bar & Instructions */}
          <div className="w-full max-w-xl text-center space-y-1 z-20">
            {currentBanner.title && (
              <h3 className="text-sm sm:text-base font-bold text-[#FAF9F5]">
                {currentBanner.title}
              </h3>
            )}
            <p className="text-[11px] text-[#9A978F]">
              Swipe left/right or use arrows to view all menu card pages
            </p>
          </div>
        </div>
      )}
    </>
  );
}
