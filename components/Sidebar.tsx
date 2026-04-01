"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Stethoscope,
  Users,
  CalendarDays,
  FileText,
  CreditCard,
  LogOut,
} from "lucide-react";
import { getDoctorAuth, logoutDoctor } from "@/app/clinic-store/localStorage";

interface SidebarProps {
  doctor: any;
  slotsCount: number;
}

export default function Sidebar({ doctor, slotsCount }: SidebarProps) {
  const router = useRouter();

  return (
    <div className="w-64 h-screen sticky top-0 bg-white shadow-lg flex flex-col">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-20"
      >
        <Image
          src="/clinic.avif"
          alt="Logo"
          width={64}
          height={64}
          className="h-26 w-36 rounded-xl border border-gray-300 p-1"
          priority
          unoptimized
        />
      </motion.div>

      {/* Scrollable Section */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-teal-50"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a0a0a0 #f5f5f5",
        }}
      >
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-start gap-2">
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-300 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
              {doctor?.name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-sm">{doctor?.name || "Dr. Johanna"}</p>
              <p className="text-xs text-gray-500">{doctor?.specialty || "Cardiology"}</p>
              <p className="text-xs text-gray-400">{doctor?.email || "dr.johanna@email.com"}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">Last login: {doctor?.lastLogin || "2 days ago"}</p>
        </div>

        {/* Menu Card */}
        <div className="bg-white rounded-xl shadow p-2 space-y-1">
          <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
            <Stethoscope className="w-5 h-5 text-teal-500" />
            Dashboard
          </div>

          <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
            <Users className="w-5 h-5 text-teal-500" />
            Chat
            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">17</span>
          </div>

          <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
            <CalendarDays className="w-5 h-5 text-teal-500" />
            Schedule
            <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">{slotsCount}</span>
          </div>

          <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
            <FileText className="w-5 h-5 text-teal-500" />
            Reports
          </div>
        </div>

        {/* Database Card */}
        <div className="bg-white rounded-xl shadow p-2">
          <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Databases</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
              <FileText className="w-5 h-5 text-teal-500" /> Documents
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
              <Users className="w-5 h-5 text-teal-500" /> Patients
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
              <CreditCard className="w-5 h-5 text-teal-500" /> Billing & Insurance
              <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">10</span>
            </div>
          </div>
        </div>

        {/* Groups Card */}
        <div className="bg-white rounded-xl shadow p-2">
          <p className="text-gray-400 uppercase text-xs font-semibold mb-2">Groups</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Operational staff
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-teal-50 rounded cursor-pointer transition">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> Cardiac surgeons
            </div>
          </div>
        </div>
      </div>

      {/* Logout Fixed Bottom */}
      <div className="p-3 border-t">
        <button
          onClick={() => {
            logoutDoctor();
            router.replace("/clinic-auth/doctor-login");
          }}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl shadow hover:scale-105 transition-transform duration-200"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </div>
  );
}