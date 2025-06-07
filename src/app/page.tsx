"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const lines = [
    "Coming up in November",
    "Next Generation Cultural Festival",
    "Bring together Local and international communities",
    "Join us and build the future of festivals together",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % lines.length);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [index, lines.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-white text-5xl md:text-8xl font-bold drop-shadow-lg text-center mb-8 font-persona-aura">
          Welcome to Alchemist Garden
        </h1>
        <div className="h-12 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="text-white text-xl md:text-3xl font-medium drop-shadow text-center px-4 font-tan-pearl"
            >
              {lines[index]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/40 z-5" />
    </div>
  );
}
