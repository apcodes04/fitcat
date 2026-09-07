"use client";

import { FaInstagram } from "react-icons/fa6";

export default function InstagramIcon({ className = "w-4 h-4", color = "#E1306C" }) {
  return <FaInstagram className={className} style={{ color: color || "#E1306C" }} />;
}
