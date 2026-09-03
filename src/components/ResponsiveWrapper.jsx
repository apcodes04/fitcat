"use client";

import { useState, useEffect } from "react";
import DesktopView from "./views/DesktopView";
import MobileView from "./views/MobileView";

export default function ResponsiveWrapper() {
  const [viewMode, setViewMode] = useState("auto"); // "auto", "desktop", "mobile"
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectiveMode = viewMode === "auto" ? (isMobileDevice ? "mobile" : "desktop") : viewMode;

  return (
    <>
      {effectiveMode === "mobile" ? (
        <MobileView onToggleView={(mode) => setViewMode(mode)} currentViewMode={effectiveMode} />
      ) : (
        <DesktopView onToggleView={(mode) => setViewMode(mode)} currentViewMode={effectiveMode} />
      )}
    </>
  );
}
