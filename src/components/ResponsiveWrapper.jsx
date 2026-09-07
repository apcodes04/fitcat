"use client";

import { useState, useEffect } from "react";
import DesktopView from "./views/DesktopView";
import MobileView from "./views/MobileView";

export default function ResponsiveWrapper() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  return isMobileDevice ? <MobileView /> : <DesktopView />;
}
