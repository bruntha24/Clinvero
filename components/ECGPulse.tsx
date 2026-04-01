"use client";

import { motion } from "framer-motion";

export default function ECGPulse() {
  return (
    <motion.svg
      viewBox="0 0 800 100"
      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[300%] opacity-20"
      initial={{ x: "-50%" }}
      animate={{ x: "0%" }}
      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
    >
      <polyline
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        points="
          0,50 40,50 60,30 80,70 100,50 140,50 160,35 180,65
          200,50 240,50 260,25 280,75 300,50 340,50 360,30
          380,70 400,50 440,50 460,25 480,75 500,50 540,50
          560,35 580,65 600,50 640,50 660,30 680,70 700,50
          740,50 760,25 780,75 800,50
        "
      />
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </motion.svg>
  );
}     