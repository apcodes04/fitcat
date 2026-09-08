"use client";

export default function Logo({ className = "h-12 w-auto", showTagline = true, color = "#E5C158", cropped = false }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <img
        src="/images/fitcat_brand_logo.png"
        alt="Fitcat Official Brand Logo"
        className={`h-full w-auto object-contain rounded-xl shadow-md transition-all duration-300 ${
          cropped ? "max-h-12 border border-[#263629]" : ""
        }`}
      />
    </div>
  );
}
