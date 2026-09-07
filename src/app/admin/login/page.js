"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to check if email is whitelisted in environment variables
  const isAuthorizedEmail = (email) => {
    if (!email) return false;
    const allowedEmails = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase());
    return allowedEmails.includes(email.toLowerCase());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAuthorizedEmail(user.email)) {
        router.push("/admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (isAuthorizedEmail(user.email)) {
        router.push("/admin");
      } else {
        await signOut(auth);
        setError(`⛔ Access Denied: (${user.email}) is not an authorized admin.`);
      }
    } catch (err) {
      console.error("Google Sign-In Error details:", err);
      if (err.code === "auth/unauthorized-domain") {
        setError("Domain not authorized in Firebase. Add your domain in Firebase Console ➔ Authentication ➔ Settings ➔ Authorized domains.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else {
        setError(err.message || "Sign-in failed. Please check browser permissions and domain settings.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f120f] text-[#FAF9F5] font-sans flex items-center justify-center p-4">
      <div className="bg-[#162118] border border-[#263629] rounded-[.85rem] p-8 max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Logo className="h-16 w-auto mx-auto" />
          <h1 className="text-2xl font-extrabold text-[#E5C158]">Admin Portal</h1>
          <p className="text-xs text-[#9A978F]">Sign in with authorized Google OAuth account</p>
        </div>

        {error && (
          <div className="bg-red-600/90 text-white text-xs font-bold p-3 rounded-xl border border-red-400 text-center leading-relaxed">
            {error}
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="space-y-4 pt-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-[#05c92f] hover:bg-[#3ade5c] text-[#0f110f] font-bold py-3.5 px-4 rounded-full shadow flex items-center justify-center gap-3 transition transform hover:scale-[1.02] disabled:opacity-50 text-xs"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{loading ? "Signing in..." : "Sign in with Google OAuth"}</span>
          </button>

          <p className="text-[11px] text-[#9A978F] text-center leading-relaxed">
            Restricted access. Only authorized admin Google accounts can enter the Fitcat dashboard.
          </p>
        </div>

        <div className="pt-2 text-center">
          <a href="/" className="text-xs text-[#E5C158] hover:underline font-bold">
            ← Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
