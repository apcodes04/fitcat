"use client";

import Logo from "./Logo";

export default function MapSection() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-fitcat-gold/30 shadow-2xl bg-fitcat-darkgreen">
      {/* Google Maps Embed */}
      <div className="w-full h-[380px] sm:h-[450px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1884.9680357156096!2d72.9276862139752!3d19.110460263218258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1788429746678!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "contrast(1.05) saturate(1.1)" }}
          allowLineWidth=""
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Fitcat Location Map - Vikhroli East Railway Station"
        ></iframe>
      </div>

      {/* Brand Logo & Location Overlay Card */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-fitcat-green/95 backdrop-blur-md text-fitcat-cream border-2 border-fitcat-gold p-4 rounded-xl shadow-2xl transition-transform hover:scale-[1.02]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-fitcat-cream text-fitcat-green rounded-full p-1.5 flex items-center justify-center shadow-inner">
            <Logo showTagline={false} color="#1B4D36" className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-fitcat-cream leading-tight">fitcat</h3>
            <p className="text-xs text-fitcat-gold font-medium italic">EAT CLEAN. FEEL GREAT.</p>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-fitcat-cream/90 pt-2 border-t border-fitcat-gold/30">
          <div className="flex items-start gap-1.5">
            <span className="text-fitcat-gold text-base">📍</span>
            <span><strong>Vikhroli East Railway Station</strong>, Mumbai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-fitcat-gold text-base">⏰</span>
            <span className="bg-fitcat-gold/20 px-2 py-0.5 rounded text-fitcat-gold font-bold">6:30 AM – 9:30 AM Daily</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-fitcat-gold text-base">📞</span>
            <a href="tel:+917977034609" className="hover:underline text-fitcat-cream font-semibold">+91 7977034609</a>
          </div>
        </div>

        <a
          href="https://maps.app.goo.gl/WgBfRgb4XHhXwNNv5"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block w-full text-center bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-bold text-xs py-2 px-3 rounded-lg shadow transition"
        >
          Open Directions in Google Maps ➔
        </a>
      </div>
    </div>
  );
}
