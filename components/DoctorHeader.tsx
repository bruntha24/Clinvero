"use client";

import { motion } from "framer-motion";
import { Stethoscope, CalendarPlus, CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";

interface DoctorHeaderProps {
  doctor?: {
    id: string;
    name?: string;
    specialty?: string;
  };
}

export default function DoctorHeader({ doctor }: DoctorHeaderProps) {
  const router = useRouter();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      className="bg-white rounded-3xl shadow-md border border-teal-100 px-10 py-6 flex justify-between items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Left Section: Greeting */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-200 to-teal-300 flex items-center justify-center shadow-sm">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 leading-snug">
            {getGreeting()}
            {doctor?.name ? `,  ${doctor.name}` : ", Doctor"}
          </h1>
        </div>
        <p className="text-gray-500 text-sm tracking-wide ml-20">
          {doctor?.specialty} • Manage your appointments efficiently
        </p>
      </div>

      {/* Middle Spacer */}
      <div className="flex-1 mx-6 border-l border-gray-200/40"></div>

      {/* Right Section: Date & Actions */}
      <div className="flex flex-col items-end gap-3 min-w-[220px]">
        <p className="text-sm text-gray-400 font-medium tracking-wide">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() =>
              document.querySelector("input[type='date']")?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex items-center gap-2 bg-teal-400 text-white px-5 py-2.5 rounded-2xl shadow-md hover:bg-teal-500 hover:shadow-lg transition-all duration-300 font-medium"
          >
            <CalendarPlus className="w-5 h-5" /> Add Slot
          </button>
          <button
            onClick={() => router.push(`/appointment/${doctor?.id}`)}
            className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            <CalendarDays className="w-4 h-4" /> View Schedule
          </button>
        </div>
      </div>
    </motion.div>
  );
}