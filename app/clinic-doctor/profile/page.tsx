"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDoctorAuth } from "@/app/clinic-store/localStorage";
import { doctors } from "@/lib/mock-data";
import { getSlots } from "@/app/clinic-store/localStorage";

export default function DoctorProfile() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<any>(null);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalSlots, setTotalSlots] = useState(0);

  useEffect(() => {
    const auth = getDoctorAuth();

    if (!auth || !auth.loggedIn) {
      router.replace("/clinic-doctor/login");
      return;
    }

    const currentDoctor = doctors.find(
      (doc) => String(doc.id) === String(auth.id)
    );

    setDoctor(currentDoctor);

    const allSlots = getSlots().filter(
      (slot) => String(slot.doctorId) === String(auth.id)
    );

    setTotalSlots(allSlots.length);

    const booked = allSlots.reduce(
      (sum, slot) => sum + (slot.bookedCount || 0),
      0
    );

    setTotalPatients(booked);
  }, [router]);

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          Doctor Profile
        </h2>

        <div className="space-y-2">
          <p><strong>Name:</strong> {doctor.name}</p>
          <p><strong>Specialty:</strong> {doctor.specialty}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-xl font-bold">{totalSlots}</p>
            <p>Total Slots</p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg text-center">
            <p className="text-xl font-bold">{totalPatients}</p>
            <p>Total Patients</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/clinic-doctor/manage-schedule")}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Manage Schedule
        </button>
      </div>
    </div>
  );
}