"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Users,
  Clock,
  MessageSquare,
  Phone,
  UserPlus,
} from "lucide-react";
import { doctors } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";

export default function DoctorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const doctor = doctors.find((d) => d.id.toString() === id);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!doctor) {
    return (
      <div className="p-10 text-center text-gray-500 text-lg">
        Doctor not found
      </div>
    );
  }

  const bannerImages = ["/inje.avif", "/inje2.avif", "/inje3.avif", "/inje5.avif"];
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ================= HERO ================= */}
      <div className="relative">
        <div className="h-56 rounded-b-[3rem] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBanner}
              src={bannerImages[currentBanner]}
              alt="banner"
              className="absolute w-full h-56 object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute top-6 left-4 right-4 flex justify-between z-10">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-white/20 backdrop-blur text-white"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* ================= CARD ================= */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-6 mt-[-80px] relative z-10"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-10">

            {/* ================= LEFT + MIDDLE + RIGHT ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">

              {/* ================= LEFT ================= */}
              <div className="flex flex-col items-center lg:items-start gap-6">
  {/* Doctor Image */}
  <motion.img
    whileHover={{ scale: 1.05 }}
    src={doctor.image}
    alt={doctor.name}
    className="w-56 h-56 rounded-3xl object-cover shadow-2xl"
  />

  {/* Name + Specialty */}
  <div className="text-center lg:text-left mt-8"> {/* added mt-4 for spacing */}
    <h1 className="text-3xl font-bold">{doctor.name}</h1>
    <p className="text-blue-600 font-semibold mt-1">{doctor.specialty}</p>
  </div>

  {/* About Doctor */}
  <div className="mt-10 text-center lg:text-left"> {/* increased mt-6 */}
    <h2 className="text-2xl font-bold mb-2">About Doctor</h2>
    <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
  </div>
</div>

              {/* ================= MIDDLE (Services + Stats) ================= */}
              <div className="flex flex-col justify-start gap-10"> {/* increased gap from 8 → 10 */}
  {/* Services */}
  <div className="mb-8"> {/* increased mb from 6 → 8 */}
    <h2 className="text-2xl font-bold mb-4">Services & Specialization</h2> {/* mb-3 → mb-4 */}
    <div className="flex flex-wrap gap-4"> {/* increased gap between pills from 3 → 4 */}
      {doctor.services.map((s) => (
        <span
          key={s}
          className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
        >
          {s}
        </span>
      ))}
    </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-2 gap-8"> {/* increased gap from 6 → 8 */}
    <div className="bg-blue-50 rounded-2xl p-6 text-center shadow-sm"> {/* p-5 → p-6 */}
      <Users className="mx-auto mb-3 text-blue-600" size={18} /> {/* mb-2 → mb-3 */}
      <p className="text-lg font-bold text-gray-900">{doctor.patients}+</p>
      <p className="text-xs text-gray-500">Patients</p>
    </div>
    <div className="bg-blue-50 rounded-2xl p-6 text-center shadow-sm">
      <Clock className="mx-auto mb-3 text-blue-600" size={18} />
      <p className="text-lg font-bold text-gray-900">{doctor.experience} yrs</p>
      <p className="text-xs text-gray-500">Experience</p>
    </div>
    <div className="bg-blue-50 rounded-2xl p-6 text-center shadow-sm">
      <Star className="mx-auto mb-3 text-blue-600" size={18} />
      <p className="text-lg font-bold text-gray-900">{doctor.rating}</p>
      <p className="text-xs text-gray-500">Rating</p>
    </div>
    <div className="bg-blue-50 rounded-2xl p-6 text-center shadow-sm">
      <MessageSquare className="mx-auto mb-3 text-blue-600" size={18} />
      <p className="text-lg font-bold text-gray-900">{doctor.reviews}</p>
      <p className="text-xs text-gray-500">Reviews</p>
    </div>
  </div>
</div>
          {/* ================= RIGHT (Actions) ================= */}
              <div className="flex flex-col items-center lg:items-stretch gap-4">

                {/* ================= Follow Button ================= */}
              <motion.div
  whileTap={{ scale: 0.95 }}
  onClick={() => setIsFollowing(!isFollowing)}
  className={`
    flex items-center gap-3 cursor-pointer rounded-full px-5 py-2
    transition-all duration-300 ease-in-out
    ${isFollowing 
      ? "bg-pink-600 text-white" 
      : "bg-gradient-to-r from-pink-400 to-pink-500 text-white"
    }
  `}
  style={{
    boxShadow: isFollowing
      ? "0 6px 12px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.2)"
      : "8px 8px 15px rgba(0,0,0,0.2), -4px -4px 10px rgba(255,255,255,0.3)"
  }}
>
  {/* Circular icon */}
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm">
    <UserPlus className="w-4 h-4 text-white" />
  </div>

  {/* Follow text */}
  <span className="font-bold uppercase tracking-wide select-none">
    {isFollowing ? "FOLLOWING" : "FOLLOW"}
  </span>
</motion.div>

               {/* ================= Chat Button ================= */}
<div className="flex items-center gap-3 cursor-pointer rounded-full shadow-md px-4 py-2 bg-green-100 text-green-700">
  <div className="bg-white rounded-full p-2 flex items-center justify-center shadow">
    <MessageSquare size={18} className="text-green-600" />
  </div>
  <span className="font-medium">Chat</span>
</div>

                {/* ================= Call Button ================= */}
               <div className="flex items-center gap-3 cursor-pointer rounded-full shadow-md px-4 py-2 bg-sky-100 text-sky-700">
  <div className="bg-white rounded-full p-2 flex items-center justify-center shadow">
    <Phone size={18} className="text-sky-600" />
  </div>
  <span className="font-medium">Call</span>
</div>

                {/* ================= Book Appointment Button ================= */}
               <button
  onClick={() => router.push(`/appointment/${doctor.id}`)}
  className="w-full py-4 mt-2 rounded-2xl bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold hover:scale-[1.02] transition-transform duration-300"
>
  Book Appointment
</button>
{/* ================= Location ================= */}
{/* Location Map */}
<div className="mt-4 w-full h-64 rounded-2xl overflow-hidden shadow-md">
  <iframe
    src={`https://www.google.com/maps?q=${encodeURIComponent(
      "123 Main Street, Madurai, India"
    )}&output=embed`}
    width="100%"
    height="100%"
    className="border-0"
    allowFullScreen={true}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Clinic Location"
  ></iframe>
</div>
              </div>

            </div>
          </div>
        </div>
      </motion.div>
      <div className="fixed bottom-0 left-0 w-full z-20">
  <BottomNav />
</div>
     
    </div>
  );
}