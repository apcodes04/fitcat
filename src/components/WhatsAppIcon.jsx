"use client";

import { FaWhatsapp } from "react-icons/fa6";

export default function WhatsAppIcon({ className = "w-4 h-4", color = "#25D366" }) {
  return <FaWhatsapp className={className} style={{ color: color || "#25D366" }} />;
}
