"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Patient } from "@/lib/patient";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";

export default function PatientDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const stored = localStorage.getItem("patients");
    if (stored) {
      const parsed: Patient[] = JSON.parse(stored);
      setPatients(parsed);
      const found = parsed.find((p) => p.id === Number(id));
      setPatient(found || null);
    }
  }, [id]);

  if (!patient)
    return (
      <p className="p-8 text-center text-red-600 font-bold text-lg">
        Patient not found ❌
      </p>
    );

  const currentIndex = patients.findIndex((p) => p.id === patient.id);

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection("left");
      router.push(`/records/${patients[currentIndex - 1].id}`);
    }
  };
  const goNext = () => {
    if (currentIndex < patients.length - 1) {
      setDirection("right");
      router.push(`/records/${patients[currentIndex + 1].id}`);
    }
  };

  const confirmDelete = (p: Patient) => setDeleteId(p.id);
  const handleDelete = (p: Patient) => {
    const updated = patients.filter((pt) => pt.id !== p.id);
    setPatients(updated);
    localStorage.setItem("patients", JSON.stringify(updated));
    setDeleteId(null);

    if (updated.length > 0) {
      const newIndex = Math.min(currentIndex, updated.length - 1);
      router.push(`/records/${updated[newIndex].id}`);
    } else {
      router.push("/records");
    }
  };

  const cardVariants = {
    enter: (dir: string) => ({ x: dir === "right" ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: string) => ({ x: dir === "right" ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/clinic.avif')",
          filter: "brightness(0.45) blur(1px)",
        }}
      />
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-start items-center px-4 pt-16 pb-4">
        {/* Page Title */}
     <div className="bg-teal-50 p-6 rounded-2xl shadow-sm flex flex-col items-center text-center">
  <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-900 tracking-tight">
    Patient Details
  </h1>
  <p className="text-teal-800/70 text-sm mt-1">
    {patients.length} registered patients
    <span className="mx-2">•</span>
    <span>Hospital Management System</span>
  </p>
</div>
        {/* Patient Card */}
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {/* Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white transition disabled:opacity-40 shadow-md"
            >
              <ChevronLeft className="w-6 h-6 text-teal-700" />
            </button>
            <button
              onClick={() => router.push("/records")}
              className="px-6 py-2 rounded-xl bg-gray-700 bg-opacity-80 text-white hover:bg-gray-800 shadow-md transition font-medium"
            >
              ← Back to Records
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex === patients.length - 1}
              className="p-2 rounded-xl bg-white/60 backdrop-blur-sm hover:bg-white transition disabled:opacity-40 shadow-md"
            >
              <ChevronRight className="w-6 h-6 text-teal-700" />
            </button>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={patient.id}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35 }}
              className="bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl p-8"
            >
              {/* Card Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-4xl md:text-5xl font-extrabold text-teal-800 drop-shadow-lg">
                  {patient.name}
                </h2>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => router.push(`/records/edit/${patient.id}`)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow-sm font-medium"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(patient)}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition shadow-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-gray-900 text-lg md:text-xl font-semibold">
                <p>
                  <span className="text-teal-700 font-medium">Department:</span> {patient.department}
                </p>
                <p>
                  <span className="text-teal-700 font-medium">Status:</span>{" "}
                  <span className="text-green-700">{patient.status}</span>
                </p>
                <p>
                  <span className="text-teal-700 font-medium">Age:</span> {patient.age}
                </p>
                <p>
                  <span className="text-teal-700 font-medium">Blood Type:</span> {patient.blood}
                </p>
                <p>
                  <span className="text-teal-700 font-medium">Bed Number:</span> {patient.bedNumber}
                </p>
                <p>
                  <span className="text-teal-700 font-medium">Total Visits:</span> {patient.totalVisits}
                </p>
              </div>

              {/* Vitals */}
              <div className="mt-8 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-teal-200">
                <h2 className="text-2xl font-bold text-teal-800 mb-4 drop-shadow-md">Vitals</h2>
                <ul className="space-y-2 text-gray-800 font-medium">
                  {Object.entries(patient.vitals).map(([key, v]) => (
                    <li
                      key={key}
                      className="flex justify-between border-b border-gray-300 pb-1 capitalize"
                    >
                      <span>{key}</span>
                      <span>
                        {v.value} <span className="text-sm text-gray-500 italic">({v.status})</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Medical History */}
              <div className="mt-8 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-teal-200">
                <h2 className="text-2xl font-bold text-teal-800 mb-4 drop-shadow-md">
                  Medical History
                </h2>
                <div className="space-y-4">
                  {patient.history.map((h, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-300 p-4 rounded-xl bg-white/90 shadow-sm space-y-3"
                    >
                      {Object.entries(h).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-semibold text-teal-700 capitalize">{key}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-20">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center space-y-4"
          >
            <p className="text-lg font-semibold text-gray-800">
              Are you sure you want to delete this patient?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => patient && handleDelete(patient)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition font-medium"
              >
                No
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full z-10">
        <BottomNav />
      </div>
    </div>
  );
}