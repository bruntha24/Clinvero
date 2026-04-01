"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarPlus,
  Trash2,
  Users,
  CalendarDays,
} from "lucide-react";
import {
  getDoctorAuth,
  logoutDoctor,
  getSlots,
  saveSlots,
  Slot,
  Patient,
} from "@/app/clinic-store/localStorage";
import BottomNav from "@/components/BottomNav";
import { doctors } from "@/lib/mock-data";
import Sidebar from "@/components/Sidebar";
import DeleteSlotModal from "@/components/DeleteSlotModal";
import DoctorHeader from "@/components/DoctorHeader";
import PrescribeMedicineForm from "@/components/PrescribeMedicineForm";
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const slotsData = [
  { value: 12 },
  { value: 18 },
  { value: 15 },
  { value: 22 },
  { value: 19 },
  { value: 25 },
  { value: 28 },
];

const patientsData = [
  { value: 30 },
  { value: 40 },
  { value: 35 },
  { value: 50 },
  { value: 45 },
  { value: 60 },
  { value: 75 },
];

export default function ManageSchedule() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [prescribeSlot, setPrescribeSlot] = useState<string | null>(null);
  const [deleteSlotId, setDeleteSlotId] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxPatients, setMaxPatients] = useState(5);

  const [searchName, setSearchName] = useState("");
  const [genderFilter, setGenderFilter] = useState<"All" | "Male" | "Female" | "Other">("All");

  useEffect(() => {
    const auth = getDoctorAuth();
    if (!auth || !auth.loggedIn) {
      router.replace("/clinic-auth/doctor-login");
      return;
    }

    const currentDoctor = doctors.find((d) => String(d.id) === String(auth.id));
    setDoctor(currentDoctor);

    refreshSlots();
    setLoading(false);
  }, [router]);

  const refreshSlots = () => {
    const auth = getDoctorAuth();
    if (!auth) return;

    const allSlots = getSlots();
    const doctorSlots = allSlots.filter((s) => s.doctorId === auth.id);

    // Sync patients token and booked count
    const syncedSlots = doctorSlots.map((s) => {
      if (s.patients && s.patients.length > 0) {
        s.patients = s.patients
          .sort((a, b) => a.token - b.token)
          .map((p, index) => ({ ...p, token: index + 1 }));
      }
      return { ...s, bookedCount: s.patients?.length || 0 };
    });

    setSlots(syncedSlots);
    setTotalPatients(syncedSlots.reduce((sum, s) => sum + s.bookedCount, 0));

    if (selectedSlot && !syncedSlots.find((s) => s.id === selectedSlot.id))
      setSelectedSlot(null);
  };

  const addSlot = (e: FormEvent) => {
    e.preventDefault();
    const auth = getDoctorAuth();
    if (!auth) return;

    const newSlot: Slot = {
      id: crypto.randomUUID(),
      doctorId: auth.id,
      date,
      startTime,
      endTime,
      type: "In-Person",
      maxPatients,
      bookedCount: 0,
      patients: [],
    };

    saveSlots([...getSlots(), newSlot]);
    refreshSlots();

    setDate("");
    setStartTime("");
    setEndTime("");
    setMaxPatients(5);
  };



  const confirmDeleteSlot = (id: string) => setDeleteSlotId(id);

  const deleteSlot = () => {
    if (!deleteSlotId) return;

    saveSlots(getSlots().filter((s) => s.id !== deleteSlotId));
    setDeleteSlotId(null);
    refreshSlots();
  };

  const getFilteredPatients = (patients: Patient[] | undefined) => {
    if (!patients) return [];
    return patients.filter((p) => {
      const matchesName = p.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesGender = genderFilter === "All" || p.gender === genderFilter;
      return matchesName && matchesGender;
    });
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex bg-teal-50">

{/* ================= SIDEBAR ================= */}
<Sidebar doctor={doctor} slotsCount={slots.length} />

     {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
{/* ================= HEADER ================= */}
<DoctorHeader doctor={doctor} />
{/* ================= STATS CARDS (SIDE BY SIDE) ================= */}
<motion.div
  className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
  variants={container}
  initial="hidden"
  animate="show"
>

  {/* ================= TOTAL PATIENTS ================= */}
  <motion.div variants={item}>
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-blue-400 to-teal-300 hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-2xl h-full">

      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 h-full flex flex-col justify-between">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {totalPatients}
            </p>
            <p className="text-xs text-blue-500 mt-1 font-medium">
              ↑ 12% increase from last week
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-blue-300 opacity-30 blur-xl rounded-full group-hover:opacity-50 transition"></div>
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-400 to-teal-400 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-blue-100"></div>

        {/* Description */}
        <p className="text-sm text-gray-600">
          Active and registered patients currently under consultation.
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-4">
          Updated automatically from appointment records.
        </p>

      </div>
    </div>
  </motion.div>


  {/* ================= TOTAL SLOTS ================= */}
  <motion.div variants={item}>
    <div className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-teal-300 to-blue-400 hover:scale-[1.02] transition-all duration-300 shadow-md hover:shadow-2xl h-full">

      <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 h-full flex flex-col justify-between">

        {/* Header */}
 <div className="flex items-center justify-between">
     <div>
            <p className="text-sm text-gray-500">Total Slots</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">
              {slots.length}
            </p>
            <p className="text-xs text-teal-500 mt-1 font-medium">
              + 5 new slots added today
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-teal-300 opacity-30 blur-xl rounded-full group-hover:opacity-50 transition"></div>
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-400 to-blue-400 flex items-center justify-center shadow-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-teal-100"></div>

        {/* Description */}
        <p className="text-sm text-gray-600">
          Available consultation slots across upcoming dates.
        </p>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-4">
          Reflects real-time scheduling updates.
        </p>

      </div>
    </div>
  </motion.div>

</motion.div>
 {/* ================= ADD SLOT FORM ================= */}
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-white rounded-xl shadow overflow-hidden"
>
  {/* Header */}
  <div className="bg-gradient-to-r from-blue-400 to-teal-400 p-4 text-white font-semibold flex items-center gap-2">
    <CalendarPlus className="w-5 h-5" />
    Add New Slot
  </div>

  {/* Form Inputs */}
  <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
      placeholder="Select Date"
    />
    <input
      type="time"
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
      placeholder="Start Time"
    />
    <input
      type="time"
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
      placeholder="End Time"
    />
    <input
      type="number"
      value={maxPatients}
      min={1}
      onChange={(e) => setMaxPatients(Number(e.target.value))}
      className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
      placeholder="Max Patients"
    />

    {/* Submit Button */}
    <button
      onClick={addSlot}
      className="sm:col-span-4 bg-gradient-to-r from-blue-400 to-teal-400 text-white py-2 rounded-lg shadow hover:opacity-90 flex items-center justify-center gap-2 mt-2 transition-all"
    >
      <CalendarPlus className="w-4 h-4" /> Add Slot
    </button>
  </div>
</motion.div>
{/* Search & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-4 rounded-xl shadow">
            <input type="text" placeholder="Search patient by name..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="border rounded p-2 flex-1"/>
            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value as any)} className="border rounded p-2">
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>     

          {/* Slots List */}
      {/* Slots List */}
<motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
  {slots.length === 0 && (
    <motion.p variants={item} className="text-gray-500 text-center py-8">
      No slots added
    </motion.p>
  )}

  {slots.map((slot) => (
    <motion.div key={slot.id} variants={item} layout>
      <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition border-l-4 border-teal-300">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <p className="font-semibold text-gray-900">{slot.date}</p>
            <p className="text-sm text-gray-600">
              {slot.startTime} - {slot.endTime}
            </p>
            <p className="text-sm text-gray-600">
              Max: {slot.maxPatients} | Booked: {slot.bookedCount}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            {/* View Patients Button */}
            {slot.patients && slot.patients.length > 0 && (
  <button
    onClick={() =>
      setSelectedSlot(selectedSlot?.id === slot.id ? null : slot)
    }
    className={`px-4 py-1 rounded-full transition ${
      selectedSlot?.id === slot.id
        ? "bg-teal-300 text-teal-900 hover:bg-teal-400"
        : "bg-teal-400 text-white hover:bg-teal-500"
    }`}
  >
    {selectedSlot?.id === slot.id ? "Hide Patients" : "View Patients"}
  </button>
)}
            {slot.patients && slot.patients.length > 0 && (
  <button
    onClick={() => setPrescribeSlot(slot.id)}
    className="px-4 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
  >
    Prescribe Medicine
  </button>
)}

{prescribeSlot === slot.id && (
  <PrescribeMedicineForm
   slotId={prescribeSlot} // now TypeScript knows it's string
    onClose={() => setPrescribeSlot(null)}
  />
)}
            {/* Delete Button */}
            <button
              onClick={() => confirmDeleteSlot(slot.id)}
              className="p-2 rounded hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {/* Patients List */}
        <AnimatePresence>
          {selectedSlot?.id === slot.id && slot.patients && slot.patients.length > 0 && (
  <motion.div
    layout
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className="mt-4 border-t border-gray-200 pt-3 space-y-3"
  >
              {getFilteredPatients(slot.patients).map((p: Patient) => (
                <motion.div
                  key={p.id}
                  layout
                  className="bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm"
                >
                  <div><strong>Name:</strong> {p.name}</div>
                  <div><strong>Email:</strong> {p.email}</div>
                  <div><strong>Phone:</strong> {p.phone}</div>
                  <div><strong>Age:</strong> {p.age}</div>
                  <div><strong>Gender:</strong> {p.gender}</div>
                  <div><strong>Reason:</strong> {p.reason}</div>
                  <div><strong>Token:</strong> {p.token}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  ))}
</motion.div>       
      <DeleteSlotModal
  isOpen={!!deleteSlotId}
  onCancel={() => setDeleteSlotId(null)}
  onConfirm={deleteSlot}
/> 
 </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full z-20">
              <BottomNav />
            </div>
    </div>
  );
}     