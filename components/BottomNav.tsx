"use client";

import {
  Home,
  Calendar,
  FileText,
  User,
  ShoppingCart,
  Phone,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Nav items (Messages removed)
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Calendar, label: "Book", path: "/doctors" },
    { icon: FileText, label: "Records", path: "/records" },
    { icon: ShoppingCart, label: "Medicine", path: "/medicine" },
    { icon: Phone, label: "Manage Schedule", path: "/clinic-auth/doctor-login" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto px-3 max-w-[480px] z-50">
      <AnimatePresence mode="wait">
        {collapsed ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-center"
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCollapsed(false)}
              className="w-14 h-14 flex items-center justify-center rounded-full 
              bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-2xl"
            >
              <ChevronRight size={22} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-3xl shadow-2xl rounded-3xl border border-white/40 p-2"
          >
            <div className="flex items-center px-2 py-2">
              {/* Collapse Button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setCollapsed(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg"
              >
                <ChevronLeft size={18} />
              </motion.button>

              {/* Nav Items */}
              <div className="flex flex-1 justify-around items-center relative px-1">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <motion.div
                      key={index}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => router.push(item.path)}
                      className="relative flex flex-col items-center cursor-pointer group"
                    >
                      {/* Active Glow Background */}
                      {isActive && (
                        <motion.div
                          layoutId="active-pill"
                          className="absolute -top-2 w-12 h-12 rounded-full bg-teal-500/20 blur-xl"
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300
                        ${isActive
                          ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-xl"
                          : "bg-teal-50 text-teal-600 group-hover:bg-teal-100"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      {/* Label */}
                      <span
                        className={`text-[11px] mt-1 font-medium transition-all duration-300
                        ${isActive
                          ? "text-teal-600 font-semibold"
                          : "text-gray-500 group-hover:text-teal-600"
                        }`}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}