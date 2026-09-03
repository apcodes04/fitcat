"use client";

import Logo from "@/components/Logo";
import MapSection from "@/components/MapSection";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-fitcat-green text-fitcat-cream font-sans">
      {/* Header Bar */}
      <header className="bg-fitcat-darkgreen border-b border-fitcat-gold/30 px-6 py-4 flex items-center justify-between shadow-lg">
        <a href="/" className="flex items-center gap-3">
          <Logo className="h-12 w-auto" />
        </a>
        <div className="flex items-center gap-6 text-sm font-bold">
          <a href="/" className="hover:text-fitcat-gold transition">← Back to Home & Menu</a>
          <a href="/admin" className="hover:text-fitcat-gold text-fitcat-gold">🔒 Admin Portal</a>
        </div>
      </header>

      {/* Main About Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="bg-fitcat-gold/20 text-fitcat-gold text-xs font-black uppercase px-4 py-1.5 rounded-full border border-fitcat-gold/40">
            About Fitcat Mumbai
          </span>
          <h1 className="text-4xl sm:text-5xl font-black">EAT CLEAN. FEEL GREAT.</h1>
          <p className="text-fitcat-cream/80 text-sm max-w-xl mx-auto">
            Nourishing morning power breakfasts prepared fresh every morning for Mumbai commuters and health enthusiasts.
          </p>
        </div>

        {/* Business Card & Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-fitcat-darkgreen/80 p-8 rounded-3xl border-2 border-fitcat-gold/30 shadow-2xl">
          <div className="md:col-span-5">
            <div className="border-4 border-fitcat-gold rounded-2xl overflow-hidden shadow-2xl transform rotate-1 hover:rotate-0 transition duration-300">
              <img src="/images/business_card.jpeg" alt="Fitcat Business Card - Harsh Karangutkar" className="w-full h-auto" />
            </div>
          </div>
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-black text-fitcat-gold">Our Vision & Story</h2>
            <p className="text-sm text-fitcat-cream/90 leading-relaxed">
              <strong>Fitcat</strong> was born right outside Vikhroli East Railway Station with a clear mission: to make healthy, wholesome, clean morning food accessible to daily station commuters and fitness lovers.
            </p>
            <p className="text-sm text-fitcat-cream/90 leading-relaxed">
              We believe that good food creates a good mood. That's why every Peanut Butter Banana Sandwich, Superfood Chia Pudding, Oats bowl, and Fresh Fruit Bowl is prepared fresh daily with zero artificial preservatives.
            </p>
            
            <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-fitcat-green p-3 rounded-xl border border-fitcat-gold/30">
                <span className="font-extrabold text-fitcat-gold block">👨‍🍳 Founder</span>
                <span className="text-sm font-bold">Harsh Karangutkar</span>
              </div>
              <div className="bg-fitcat-green p-3 rounded-xl border border-fitcat-gold/30">
                <span className="font-extrabold text-fitcat-gold block">⏰ Operational Timings</span>
                <span className="text-sm font-bold text-fitcat-gold">6:30 AM – 9:30 AM</span>
              </div>
              <div className="bg-fitcat-green p-3 rounded-xl border border-fitcat-gold/30">
                <span className="font-extrabold text-fitcat-gold block">📱 Official Instagram</span>
                <a href="https://instagram.com/fitcatmumbai" target="_blank" rel="noreferrer" className="text-sm font-bold underline hover:text-fitcat-gold">@fitcatmumbai</a>
              </div>
              <div className="bg-fitcat-green p-3 rounded-xl border border-fitcat-gold/30">
                <span className="font-extrabold text-fitcat-gold block">📞 Order Contact</span>
                <a href="tel:+917977034609" className="text-sm font-bold underline hover:text-fitcat-gold">+91 7977034609</a>
              </div>
            </div>
          </div>
        </div>

        {/* Location Map Section with Logo Overlay */}
        <section className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-black text-fitcat-gold">📍 Visit Our Outlet</h2>
            <p className="text-xs text-fitcat-cream/80">Vikhroli East Railway Station, Mumbai • Open 6:30 AM - 9:30 AM</p>
          </div>
          <MapSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-fitcat-darkgreen border-t border-fitcat-gold/30 py-6 px-6 text-center text-xs text-fitcat-cream/70 mt-12">
        <p>© {new Date().getFullYear()} Fitcat (fitcat.in). All rights reserved.</p>
      </footer>
    </div>
  );
}
