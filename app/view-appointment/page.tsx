"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { doctors } from "@/lib/mock-data";
import { Calendar, Clock, ArrowRight, Trash2, X, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

type Appointment = {
  doctorId: string;
  date: string;
  time: string;
  token: number;
  status: "Active" | "Completed" | "Cancelled";
};

const ViewAppointmentsPage: React.FC = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apptToDelete, setApptToDelete] = useState<Appointment | null>(null);

  // Load appointments and sort by newest first
  useEffect(() => {
    const stored = localStorage.getItem("appointments");
    if (stored) {
      const parsed: Appointment[] = JSON.parse(stored);
      // Sort by date + time descending
      parsed.sort((a, b) => {
        const dtA = new Date(`${a.date} ${a.time}`);
        const dtB = new Date(`${b.date} ${b.time}`);
        return dtB.getTime() - dtA.getTime();
      });
      setAppointments(parsed);
    }
  }, []);

  const handleDeleteClick = (appt: Appointment) => {
    setApptToDelete(appt);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (!apptToDelete) return;
    const updatedAppointments = appointments.filter(
      (a) =>
        !(
          a.doctorId === apptToDelete.doctorId &&
          a.date === apptToDelete.date &&
          a.time === apptToDelete.time
        )
    );
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    setShowConfirm(false);
    setApptToDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setApptToDelete(null);
  };

  if (appointments.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-black px-4 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/clinic.avif')", filter: "brightness(0.4)" }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4 text-teal-200">No Appointments Yet</h1>
          <p className="text-gray-200 mb-6 text-center max-w-sm">
            You haven’t booked any appointments. Schedule one now with our trusted doctors!
          </p>
          <button
            onClick={() => router.push("/doctors")}
            className="px-5 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition text-sm"
          >
            Book an Appointment
          </button>
        </div>
        <div className="fixed bottom-0 left-0 w-full z-20 mt-6">
          <BottomNav />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative pb-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/clinic.avif')", filter: "brightness(0.35)" }}
      />
      <div className="relative z-10 px-4 sm:px-12 py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-teal-200 mb-2 text-center">
          My Trusted Appointments
        </h1>
        <p className="text-center text-gray-200 mb-8">
          Here’s a summary of your upcoming and past appointments with our verified doctors.
        </p>

        <div className="space-y-6">
          {appointments.map((appt, idx) => {
            const doctor = doctors.find((d) => d.id === appt.doctorId);
            if (!doctor) return null;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white/95 backdrop-blur-md rounded-3xl shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative border border-gray-200 hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-300"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-black">{doctor.name}</h3>
                    <p className="text-gray-500 text-sm">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-700 mt-3 sm:mt-0">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{appt.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{appt.time}</span>
                  </div>
                  <div>
                    <span className="font-semibold">#</span> {appt.token}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appt.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : appt.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {appt.status}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 sm:mt-0">
                  <button
                    onClick={() =>
                      router.push(
                        `/appointment/success?id=${appt.doctorId}&date=${encodeURIComponent(
                          appt.date
                        )}&time=${encodeURIComponent(appt.time)}`
                      )
                    }
                    className="px-3 py-1 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition flex items-center gap-1 shadow-md"
                  >
                    <ArrowRight size={14} /> View
                  </button>

                  <button
                    onClick={() => handleDeleteClick(appt)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-1 shadow-md"
                  >
                    <Trash2 size={14} /> Delete
                  </button>

                  <div className="flex flex-col items-center mt-2 sm:mt-0">
                    <div className="flex flex-col p-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-300 shadow-sm hover:shadow-md transition w-36 text-center">
                      <button
                        onClick={() => alert("Redirect to payment page")}
                        className="flex items-center justify-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold text-sm shadow-md"
                      >
                        <DollarSign size={16} /> Pay Now
                      </button>
                      <span className="text-xs text-gray-600 mt-1">
                        Early access — Pay now
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {showConfirm && apptToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 relative shadow-xl border border-gray-200">
            <button
              onClick={cancelDelete}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold mb-3 text-red-600">Confirm Deletion</h2>
            <p className="text-gray-700 mb-5 text-sm">
              Are you sure you want to remove your appointment with <strong>{apptToDelete.date} {apptToDelete.time}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-3 py-1 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full z-20">
        <BottomNav />
      </div>
    </div>
  );
};

export default ViewAppointmentsPage;