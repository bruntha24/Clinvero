"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { doctors } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";
import { Star } from "lucide-react";
import { getSlots, saveSlots, Patient } from "@/app/clinic-store/localStorage";

interface Slot {
  time: string;
  period: "morning" | "afternoon" | "evening";
  availableCount: number;
  originalSlotId: string;
}

export default function AppointmentPage() {
  const router = useRouter();
  const params = useParams();
  const doctorId = String(params?.id);

  const doctor = doctors.find(d => String(d.id) === doctorId);
  if (!doctor)
    return (
      <div className="p-10 text-center text-black text-lg font-semibold">
        Doctor not found
      </div>
    );

  const today = new Date();
  const [currentMonth] = useState(today.getMonth());
  const [currentYear] = useState(today.getFullYear());
  const [selectedDate] = useState(today.getDate());

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [favoriteSlot, setFavoriteSlot] = useState<string | null>(null);
  const [currentSlots, setCurrentSlots] = useState<Slot[]>([]);

  // Patient form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [reason, setReason] = useState("");

  const getFormattedDate = () =>
    `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      selectedDate
    ).padStart(2, "0")}`;

  useEffect(() => {
    const allSlots = getSlots();
    const formattedDate = getFormattedDate();

    const filtered = allSlots
      .filter(s => String(s.doctorId) === doctorId && s.date === formattedDate)
      .map(s => {
        const hour = Number(s.startTime.split(":")[0]);
        const period: "morning" | "afternoon" | "evening" =
          hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

        return {
          time: `${s.startTime} - ${s.endTime}`,
          period,
          availableCount: s.maxPatients - (s.patients?.length || 0),
          originalSlotId: s.id
        };
      });

    setCurrentSlots(filtered);
    setSelectedSlot(null);
  }, [doctorId]);

  const morningSlots = currentSlots.filter(s => s.period === "morning");
  const afternoonSlots = currentSlots.filter(s => s.period === "afternoon");
  const eveningSlots = currentSlots.filter(s => s.period === "evening");

  const handleBook = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedSlot) return;
    if (!name || !email || !phone || !age || !gender || !reason) {
      alert("Please fill all patient details");
      return;
    }

    const allSlots = getSlots();
    const slotIndex = allSlots.findIndex(
      s =>
        s.id ===
        currentSlots.find(cs => cs.time === selectedSlot)?.originalSlotId
    );
    if (slotIndex === -1) return;

    const slot = allSlots[slotIndex];
    if (!slot.patients) slot.patients = [];
    if (slot.patients.length >= slot.maxPatients) {
      alert("This slot is fully booked");
      return;
    }

    const newToken = slot.patients.length + 1;
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      age,
      gender,
      reason,
      token: newToken
    };
    slot.patients.push(newPatient);
    slot.bookedCount = slot.patients.length;
    allSlots[slotIndex] = slot;
    saveSlots(allSlots);

    setName("");
    setEmail("");
    setPhone("");
    setAge("");
    setGender("");
    setReason("");
    setSelectedSlot(null);

    router.push(
      `/appointment/success?id=${doctorId}&date=${encodeURIComponent(
        getFormattedDate()
      )}&time=${encodeURIComponent(selectedSlot)}`
    );
  };

  const SlotGroup = ({ title, slots }: { title: string; slots: Slot[] }) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-3 gap-3">
        {slots.length === 0 && (
          <p className="text-gray-500 col-span-3 text-center">No slots available</p>
        )}
        {slots.map(slot => (
          <div key={slot.originalSlotId} className="flex flex-col items-center w-full">
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={slot.availableCount === 0}
              onClick={() => setSelectedSlot(slot.time)}
              className={`relative py-3 rounded-2xl text-sm font-semibold border w-full
                transition-all duration-200
                ${
                  slot.availableCount === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
                    : selectedSlot === slot.time
                    ? "bg-teal-500 text-white border-teal-500 shadow-lg"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-teal-50"
                }`}
            >
              {slot.time}
              <span
                onClick={e => {
                  e.stopPropagation();
                  setFavoriteSlot(favoriteSlot === slot.time ? null : slot.time);
                }}
                className="absolute top-1 right-1 cursor-pointer"
              >
                <Star
                  size={14}
                  className={
                    favoriteSlot === slot.time
                      ? "text-teal-500 fill-teal-500"
                      : "text-gray-300"
                  }
                />
              </span>
            </motion.button>
            <span className="mt-1 text-xs text-gray-600">
              {slot.availableCount > 0 ? `${slot.availableCount} left` : "Full"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pb-32 max-w-6xl mx-auto relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-white shadow hover:shadow-lg transition font-semibold text-gray-800"
        >
          Back
        </button>
      </div>

      {/* Doctor Header */}
      <div className="relative">
        <div
          className="h-64 rounded-b-[3rem] shadow-2xl bg-cover bg-center"
          style={{ backgroundImage: `url('/clinic.avif')` }}
        />
        <div className="flex justify-center -mt-28 relative z-10">
          <div className="rounded-3xl overflow-hidden border-4 border-white shadow-xl">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-52 h-52 object-cover"
            />
          </div>
        </div>
        <div className="px-6 sm:px-12 mt-6 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">{doctor.name}</h1>
          <p className="text-teal-600 mt-2 text-lg font-semibold">{doctor.specialty}</p>
        </div>
      </div>

      {/* Slots Section */}
      <div className="px-4 sm:px-12 mt-12 rounded-3xl relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/clinic.avif')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.85)",
            zIndex: 0
          }}
        />
        <div className="relative z-10 space-y-6 bg-white/90 p-6 rounded-3xl shadow-lg border border-gray-100 backdrop-blur-sm">
          <SlotGroup title="Morning" slots={morningSlots} />
          <SlotGroup title="Afternoon" slots={afternoonSlots} />
          <SlotGroup title="Evening" slots={eveningSlots} />
        </div>
      </div>

{/* ================= Patient Registration Form ================= */}
<motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="relative mt-16 px-4"
>
  <div className="w-full max-w-7xl mx-auto rounded-[36px] overflow-hidden 
  shadow-xl border border-gray-100 bg-white">

    {/* ===== Top Image Header ===== */}
    <div className="relative h-52 w-full">
      <img
        src="/clinic.avif"
        alt="Clinic"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-teal-900/60 flex items-center justify-center">
        <h2 className="text-4xl font-bold text-white tracking-wide">
          Patient Information Form
        </h2>
      </div>
    </div>

    {/* ===== Form Body ===== */}
    <div className="p-10 space-y-6">

      <h3 className="text-teal-600 font-semibold tracking-widest text-sm">
        INFORMATION
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="text"
          placeholder="Patient Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-200 rounded-2xl px-5 py-4 w-full focus:ring-2 focus:ring-teal-400 outline-none"
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={e => setAge(e.target.value)}
          className="border border-gray-200 rounded-2xl px-5 py-4 w-full focus:ring-2 focus:ring-teal-400 outline-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-200 rounded-2xl px-5 py-4 w-full focus:ring-2 focus:ring-teal-400 outline-none"
        />
        <input
          type="tel"
          placeholder="Cell Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border border-gray-200 rounded-2xl px-5 py-4 w-full focus:ring-2 focus:ring-teal-400 outline-none"
        />
      </div>

      <select
        value={gender}
        onChange={e => setGender(e.target.value)}
        className="border border-gray-200 rounded-2xl px-5 py-4 w-full focus:ring-2 focus:ring-teal-400 outline-none"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

      <textarea
        placeholder="Reason for Visit"
        value={reason}
        onChange={e => setReason(e.target.value)}
        rows={4}
        className="border border-gray-200 rounded-2xl px-5 py-4 w-full focus:ring-2 focus:ring-teal-400 outline-none resize-none"
      />

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleBook}
        disabled={!selectedSlot || !name || !email || !phone || !age || !gender || !reason}
        className={`w-full py-5 rounded-2xl font-bold text-lg transition
          ${
            selectedSlot && name && email && phone && age && gender && reason
              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
      >
        Book Appointment
      </motion.button>

    </div>
  </div>
</motion.div>
      <BottomNav />
    </div>
  );
}    