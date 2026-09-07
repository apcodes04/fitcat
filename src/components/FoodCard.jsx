"use client";

import { useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";
import { FaArrowRight, FaBan, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function FoodCard({ item, index, onPreOrder, variant = "mobile" }) {
  const imageList = Array.isArray(item.images) && item.images.length > 0
    ? item.images
    : (item.image && item.image.trim() !== "" ? [item.image.trim()] : ["/images/menu_poster.jpeg"]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % imageList.length);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      setIsPortrait(naturalHeight > naturalWidth * 1.05);
    }
  };

  return (
    <div className="bg-[#162118] p-5 rounded-[.75rem] border border-[#263629] hover:border-[#3d5441] shadow-sm flex flex-col justify-between transition-all duration-300 space-y-4 overflow-hidden group">
      <div>
        {/* Dynamic Portrait / Landscape Image Box */}
        {imageList.length > 0 && (
          <div
            className={`relative w-full rounded-[.5rem] overflow-hidden mb-4 border border-[#263629] bg-[#0a140c] flex items-center justify-center transition-all duration-300 ${
              isPortrait
                ? "h-64 sm:h-72 p-0"
                : "h-40 sm:h-44 p-0"
            }`}
          >
            <img
              src={imageList[activeIdx]}
              alt={`${item.name} photo ${activeIdx + 1}`}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              className="w-full h-full object-cover rounded transition-all duration-300"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/menu_poster.jpeg";
              }}
            />

            {/* Gallery Controls */}
            {imageList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-[#E5C158] p-1.5 rounded-full backdrop-blur-sm transition active:scale-95 z-10"
                  title="Previous photo"
                >
                  <FaChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-[#E5C158] p-1.5 rounded-full backdrop-blur-sm transition active:scale-95 z-10"
                  title="Next photo"
                >
                  <FaChevronRight className="w-3.5 h-3.5" />
                </button>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
                  {imageList.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIdx(dotIdx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        dotIdx === activeIdx ? "bg-[#E5C158] w-3" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Header Row: Category Badge & Golden Price */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-[#9A978F] font-mono">0{index + 1}</span>
            <span className="text-[11px] font-semibold text-[#05c92f] uppercase tracking-[.12em] bg-[#0e2413] px-2.5 py-0.5 rounded-full border border-[#1b4224]">
              {item.badge || item.category || "Fitcat Fresh"}
            </span>
          </div>

          <span className="text-base font-extrabold text-[#E5C158] bg-[#0a140c] px-3 py-0.5 rounded-full border border-[#263629] tabular-nums flex-shrink-0 shadow-inner">
            ₹{item.price}
          </span>
        </div>

        {/* Golden Product Title */}
        <h3 className="text-base sm:text-lg font-bold text-[#E5C158] tracking-[-.02em]">
          {item.name}
        </h3>

        {/* Product Description */}
        <p className="text-xs text-[#9A978F] mt-1.5 leading-[1.625]">
          {item.description}
        </p>
      </div>

      {/* Action Button */}
      <button
        disabled={!item.inStock}
        onClick={() => onPreOrder(item)}
        className={`w-full font-semibold py-2.5 rounded-full border text-xs transition duration-200 flex items-center justify-center gap-2 ${
          item.inStock
            ? "bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] border-transparent active:scale-95"
            : "bg-[#0a140c] text-[#9A978F] border-[#263629] cursor-not-allowed"
        }`}
      >
        {item.inStock ? (
          <>
            <WhatsAppIcon className="w-4 h-4" color="#0f110f" />
            <span className="font-bold">Pre-Book for ₹{item.price}</span>
            <FaArrowRight className="w-3 h-3 text-[#0f110f]" />
          </>
        ) : (
          <>
            <FaBan className="w-3.5 h-3.5 text-[#9A978F]" />
            <span>Out of Stock</span>
          </>
        )}
      </button>
    </div>
  );
}
