"use client";

import Logo from "@/components/Logo";
import MapSection from "@/components/MapSection";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import InstagramIcon from "@/components/InstagramIcon";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] font-sans selection:bg-[#05c92f]/20">
      {/* Header Bar */}
      <header className="bg-[#162118] border-b border-[#263629] px-6 py-4 flex items-center justify-between shadow-md">
        <a href="/" className="flex items-center gap-3">
          <Logo className="h-10 w-auto" />
        </a>
        <div className="flex items-center gap-6 text-xs font-bold">
          <a href="/" className="hover:text-[#E5C158] transition text-[#9A978F]">← Back to Home & Menu</a>
        </div>
      </header>

      {/* Main About Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="bg-[#0e2413] text-[#05c92f] text-xs font-bold uppercase px-4 py-1.5 rounded-full border border-[#1b4224]">
            About Fitcat Mumbai
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#E5C158]">EAT CLEAN. FEEL GREAT.</h1>
          <p className="text-[#9A978F] text-xs max-w-xl mx-auto leading-relaxed">
            Nourishing morning power breakfasts prepared fresh every morning for Mumbai commuters and health enthusiasts.
          </p>
        </div>

        {/* Business Card & Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#162118] p-8 rounded-[.85rem] border border-[#263629] shadow-md">
          <div className="md:col-span-5">
            <div className="border-4 border-[#263629] rounded-2xl overflow-hidden shadow-xl">
              <img src="/images/business_card.jpeg" alt="Fitcat Business Card - Harsh Karangutkar" className="w-full h-auto" />
            </div>
          </div>
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-bold text-[#E5C158]">Our Vision & Story</h2>
            <p className="text-xs text-[#9A978F] leading-relaxed">
              <strong className="text-[#FAF9F5]">Fitcat</strong> was born right outside Vikhroli East Railway Station with a clear mission: to make healthy, wholesome, clean morning food accessible to daily station commuters and fitness lovers.
            </p>
            <p className="text-xs text-[#9A978F] leading-relaxed">
              We believe that good food creates a good mood. That's why every Peanut Butter Banana Sandwich, Superfood Chia Pudding, Oats bowl, and Fresh Fruit Bowl is prepared fresh daily with zero artificial preservatives.
            </p>
            
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0a140c] p-3 rounded-lg border border-[#263629]">
                <span className="font-bold text-[#E5C158] block mb-0.5">👨‍🍳 Founder</span>
                <span className="text-xs font-bold text-[#FAF9F5]">Harsh Karangutkar</span>
              </div>
              <div className="bg-[#0a140c] p-3 rounded-lg border border-[#263629]">
                <span className="font-bold text-[#E5C158] block mb-0.5">⏰ Operational Timings</span>
                <span className="text-xs font-bold text-[#05c92f]">7:00 AM to 9:30 AM</span>
              </div>
              <div className="bg-[#0a140c] p-3 rounded-lg border border-[#263629]">
                <span className="font-bold text-[#E5C158] block mb-0.5">📱 Official Instagram</span>
                <a href="https://instagram.com/fitcatmumbai" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#E1306C] hover:underline flex items-center gap-1.5 mt-0.5">
                  <InstagramIcon className="w-3.5 h-3.5" color="#E1306C" />
                  <span>@fitcatmumbai</span>
                </a>
              </div>
              <div className="bg-[#0a140c] p-3 rounded-lg border border-[#263629]">
                <span className="font-bold text-[#E5C158] block mb-0.5">💬 WhatsApp Order</span>
                <a href="https://wa.me/917977034609" target="_blank" rel="noreferrer" className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1.5 mt-0.5">
                  <WhatsAppIcon className="w-3.5 h-3.5" color="#25D366" />
                  <span>+91 7977034609</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Location Map Section */}
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#E5C158]">📍 Visit Our Outlet</h2>
            <p className="text-xs text-[#9A978F] mt-0.5">Vikhroli East Railway Station, Mumbai • Open 6:30 AM to 9:30 AM</p>
          </div>
          <MapSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#162118] border-t border-[#263629] py-6 px-6 text-center text-xs text-[#9A978F] mt-12">
        <p>© {new Date().getFullYear()} Fitcat (fitcat.in). All rights reserved.</p>
      </footer>
    </div>
  );
}
