"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[420px] min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center space-y-8">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-24 w-24 rounded-2xl bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-600"
        >
          DA
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h1 className="text-2xl font-semibold text-gray-900">
            Doctor Appointment
          </h1>
          <p className="text-sm text-gray-500">
            Book appointments with trusted doctors easily
          </p>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <Link href="/login">
            <Button className="w-full bg-teal-600 hover:bg-teal-700">
              Get Started
            </Button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}