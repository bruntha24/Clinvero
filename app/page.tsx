"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Home() {
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const desktopNav = [
    "Home",
    "Doctors",
    "Book Appointment",
    "About",
    "Profile",
  ];

  const mobileNav = ["Home", "About", "Profile"];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative text-white"
      style={{ backgroundImage: "url('/hospital.avif')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* ================= NAVBAR ================= */}
      <nav className="relative z-50 flex justify-between items-center px-6 md:px-12 py-6">
        <h2 className="text-2xl font-bold tracking-wide">Clinvero</h2>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-10 font-medium relative">
          {desktopNav.map((item) => (
            <li
              key={item}
              onMouseEnter={() => setActive(item)}
              onMouseLeave={() => setActive(null)}
              className="cursor-pointer relative"
            >
              <span className="hover:text-teal-400 transition">
                {item}
              </span>

              <AnimatePresence>
                {active === item && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-10 right-0 w-80 bg-white text-black p-6 rounded-xl shadow-2xl"
                  >
                    <h3 className="font-semibold mb-2 text-lg">{item}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Clinvero delivers certified, transparent, and
                      compassionate healthcare solutions with advanced
                      technology, trusted professionals, secure patient
                      systems, and world-class medical excellence.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <div className="md:hidden z-50">
          {!mobileOpen ? (
            <Menu
              className="w-7 h-7 cursor-pointer"
              onClick={() => setMobileOpen(true)}
            />
          ) : (
            <X
              className="w-7 h-7 cursor-pointer"
              onClick={() => setMobileOpen(false)}
            />
          )}
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-72 h-full bg-gradient-to-b from-teal-600 to-blue-700 z-40 p-8 space-y-8 md:hidden shadow-2xl"
          >
            <div className="flex justify-end">
              <X
                className="w-7 h-7 cursor-pointer text-white"
                onClick={() => setMobileOpen(false)}
              />
            </div>

            {mobileNav.map((item) => (
              <div
                key={item}
                className="border-b border-white/30 pb-4"
              >
                <h3 className="font-semibold text-xl text-white">
                  {item}
                </h3>
                <p className="text-sm text-white/80 mt-2">
                  Trusted care, certified doctors, secure systems,
                  compassionate support, and healthcare excellence.
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HERO SECTION ================= */}
      <div className="relative z-10 flex items-center min-h-screen px-6 md:px-16">
        <div className="max-w-xl space-y-8">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Trusted Healthcare <br /> You Can Rely On
          </h1>

          <p className="text-base md:text-lg text-white/80 leading-relaxed">
            Delivering world-class medical excellence with integrity,
            transparency, and compassion.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/login">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full text-lg shadow-lg">
                Get Started
              </Button>
            </Link>

            <Button className="border border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full text-lg">
              Learn More
            </Button>
          </div>
          {/* Trust Words */} <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/80 mt-6"> 
          <div>✔ 250+ Certified Doctors</div> 
          <div>✔ 15+ Years of Clinical Excellence</div>
           <div>✔ 24/7 Emergency Support</div>
            <div>✔ 98% Patient Satisfaction</div>
             <div>✔ Secure Patient Data Protection</div> 
             <div>✔ Advanced AI-Powered Medical Technology</div>
              </div>

        </div>
      </div>
    </div>
  );
}