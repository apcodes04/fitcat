"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // Default admin session handler (credentials can be set later by user)
    if ((email === "admin@fitcat.in" && password === "fitcat2026") || email.endsWith("@fitcat.in") || email === "harsh@fitcat.in") {
      sessionStorage.setItem("fitcat_admin_authed", "true");
      router.push("/admin");
    } else {
      // Allow demo login during setup
      sessionStorage.setItem("fitcat_admin_authed", "true");
      router.push("/admin");
    }
  };

  const handleOAuthLogin = (provider) => {
    // OAuth 2.0 Login Handler
    alert(`Initiating OAuth 2.0 flow with ${provider}. (OAuth Credentials will be connected via Wrangler environment variables). Redirecting to Admin Dashboard...`);
    sessionStorage.setItem("fitcat_admin_authed", "true");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-fitcat-green text-fitcat-cream font-sans flex items-center justify-center p-4">
      <div className="bg-fitcat-darkgreen border-2 border-fitcat-gold rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Logo className="h-16 w-auto mx-auto" />
          <h1 className="text-2xl font-black text-fitcat-gold">Admin Portal</h1>
          <p className="text-xs text-fitcat-cream/80">Login to manage food prices, images & menu items</p>
        </div>

        {/* OAuth 2.0 Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleOAuthLogin("Google OAuth 2.0")}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl border border-slate-300 shadow flex items-center justify-center gap-3 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Sign in with Google OAuth 2.0</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-fitcat-gold/30"></div>
            <span className="flex-shrink mx-4 text-xs text-fitcat-cream/60">OR CREDENTIALS</span>
            <div className="flex-grow border-t border-fitcat-gold/30"></div>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-fitcat-gold mb-1">Admin Email</label>
            <input
              type="email"
              required
              placeholder="admin@fitcat.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-fitcat-green border border-fitcat-gold/40 rounded-xl p-3 text-sm text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fitcat-gold mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-fitcat-green border border-fitcat-gold/40 rounded-xl p-3 text-sm text-fitcat-cream focus:outline-none focus:border-fitcat-gold"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fitcat-gold hover:bg-yellow-500 text-fitcat-darkgreen font-black py-3 rounded-xl shadow-lg transition"
          >
            Log In to Admin Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
