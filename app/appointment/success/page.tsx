"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Calendar, Clock, ArrowRight, Download } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { doctors } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

const confettiColors = [
  "#14B8A6", "#22D3EE", "#FACC15", "#F87171", "#A78BFA",
  "#34D399", "#F43F5E", "#F97316", "#10B981", "#3B82F6",
  "#8B5CF6", "#EC4899", "#F59E0B", "#EF4444", "#22C55E"
];

const AppointmentSuccessPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [doctor, setDoctor] = useState<any>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [token, setToken] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);

    const doctorId = params.get("id");
    const selectedDate = params.get("date");
    const selectedTime = params.get("time");

    if (doctorId) {
      const foundDoctor = doctors.find((d) => d.id === doctorId);
      if (foundDoctor) setDoctor(foundDoctor);
    }

    if (selectedDate) setDate(selectedDate);
    if (selectedTime) setTime(selectedTime);

    // Generate or retrieve token
    if (doctorId && selectedDate && selectedTime) {
      const key = `booking_${doctorId}_${selectedDate}_${selectedTime}`;
      let savedToken = localStorage.getItem(key);
      if (!savedToken) {
        savedToken = (Math.floor(1 + Math.random() * 29)).toString();
        localStorage.setItem(key, savedToken);
      }
      const numericToken = Number(savedToken);
      setToken(numericToken);

      // Save appointment to master list
      const appointmentsKey = "appointments";
      const storedAppointments = localStorage.getItem(appointmentsKey);
      const appointments = storedAppointments ? JSON.parse(storedAppointments) : [];

      const exists = appointments.some(
        (a: any) =>
          a.doctorId === doctorId &&
          a.date === selectedDate &&
          a.time === selectedTime
      );

      if (!exists) {
        appointments.push({
          doctorId,
          date: selectedDate,
          time: selectedTime,
          token: numericToken,
          status: "Active"
        });
        localStorage.setItem(appointmentsKey, JSON.stringify(appointments));
      }
    }

    const timer = setTimeout(() => setShowPopup(false), 4000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading appointment details...
      </div>
    );
  }

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Appointment Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Doctor: ${doctor.name} (${doctor.specialty})`, 20, 40);
    doc.text(`Date: ${date}`, 20, 50);
    doc.text(`Time: ${time}`, 20, 60);
    doc.text(`Token #: ${token}`, 20, 70);
    doc.text("Status: Active", 20, 80);
    doc.save("appointment-details.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 via-white to-teal-50 relative overflow-hidden px-4 pb-28">

      {/* Confetti Layer */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {showPopup &&
            Array.from({ length: 400 }).map((_, i) => {
              const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
              const startX = Math.random() * window.innerWidth;
              const startY = Math.random() * window.innerHeight * 0.3;
              const size = Math.random() * 4 + 2;

              return (
                <motion.div
                  key={i}
                  initial={{
                    y: startY,
                    x: startX,
                    opacity: 1,
                    scale: Math.random() * 1.2 + 0.5,
                    rotate: Math.random() * 360,
                  }}
                  animate={{
                    y: startY + 600 + Math.random() * 300,
                    x: startX + Math.random() * 500 - 250,
                    rotate: Math.random() * 1080,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    ease: "easeOut",
                  }}
                  className="absolute rounded-full"
                  style={{ backgroundColor: color, width: size, height: size }}
                />
              );
            })}
        </AnimatePresence>
      </div>

      {/* Container */}
      <div className="w-full max-w-5xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-12 flex flex-col items-center space-y-10 border border-teal-100 mt-4">
        {/* Top Back Button */}
        <div className="absolute top-4 left-4">
          <Button
            variant="default"
            size="sm"
            className="w-[100px] bg-teal-600 text-white hover:bg-teal-700 flex items-center justify-center gap-2"
            onClick={() => router.back()}
          >
            ← Back
          </Button>
        </div>

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 12 }}
          className="w-36 h-36 rounded-full bg-green-100 flex items-center justify-center shadow-xl mx-auto mt-4"
        >
          <CheckCircle size={72} className="text-green-600" />
        </motion.div>

        {/* Appointment Card */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center brightness-75"
            style={{ backgroundImage: "url('/clinic.avif')" }}
          />
          <div className="relative z-10 p-6 sm:p-8 text-center space-y-6">
            <h1 className="text-3xl font-bold text-teal-800 bg-teal-50/70 p-2 rounded-md inline-block">
              Booking Confirmed!
            </h1>

            <p className="text-teal-800 bg-yellow-50 p-2 rounded-md inline-block drop-shadow-md">
              Your appointment with <strong>{doctor.name}</strong> has been successfully booked.
            </p>

            <div className="bg-white rounded-3xl p-4 sm:p-6 space-y-4 shadow-md text-left border border-teal-100 flex flex-col sm:flex-row sm:items-center gap-4">
              <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>

                <div className="h-px bg-gray-200 my-2" />

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Appointment #</span>
                  <span className="font-bold">{token}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Status</span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
                    Active
                  </span>
                </div>

                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{time}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-teal-800 bg-yellow-50 p-2 rounded-md font-semibold text-lg mt-4 inline-block drop-shadow-md">
              Caring for You, Every Step of the Way....
            </p>
          </div>
        </div>
{/* Bottom Buttons */}
<div className="w-full max-w-md mx-auto flex flex-col gap-3 sm:flex-row sm:justify-center">
  <Button
    variant="default"
    size="sm"
    className="w-full sm:w-auto px-5 py-2 text-base font-medium rounded-xl shadow-md flex items-center justify-center gap-2"
    onClick={() => router.push("/view-appointment")}
  >
    <ArrowRight size={18} />
    View My Appointments
  </Button>

<Button
  variant="outline"
  size="sm"
  className="flex-1 shadow-lg flex items-center justify-center gap-2 py-2.5"
  onClick={() => {
    const doc = new jsPDF();

/// ===== Page Setup =====
doc.setFillColor(0, 128, 128);
doc.rect(0, 0, 210, 28, "F");

// ===== Hospital Logo / Sign =====
doc.addImage("/hos.png", "png", 15, 6, 18, 18);

// ===== Hospital Header =====
doc.setTextColor(255, 255, 255);
doc.setFont("helvetica", "bold");
doc.setFontSize(22);
doc.text("Clinvero Hospital", 105, 16, { align: "center" });

doc.setFontSize(12);
doc.setFont("helvetica", "normal");
doc.text("Excellence in Healthcare & Patient Care", 105, 23, { align: "center" });

// Reset text color
doc.setTextColor(0, 0, 0);

// ===== Title Section =====
doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.text("APPOINTMENT CONFIRMATION", 105, 45, { align: "center" });

// Divider
doc.setLineWidth(0.8);
doc.line(20, 50, 190, 50);

// ===== Appointment Card Box =====
doc.setDrawColor(0);
doc.setLineWidth(0.5);
doc.roundedRect(20, 60, 170, 90, 5, 5);

// Section Title
doc.setFontSize(13);
doc.setFont("helvetica", "bold");
doc.text("Appointment Details", 30, 72);

doc.setFont("helvetica", "normal");
doc.setFontSize(12);

doc.text(`Doctor Name       : ${doctor.name}`, 30, 85);
doc.text(`Specialty         : ${doctor.specialty}`, 30, 95);
doc.text(`Appointment Date  : ${date}`, 30, 105);
doc.text(`Appointment Time  : ${time}`, 30, 115);
doc.text(`Token Number      : ${token}`, 30, 125);

// Status Highlight
doc.setFont("helvetica", "bold");
doc.setTextColor(0, 128, 0);
doc.text("Status: ACTIVE", 30, 140);

// Reset text color
doc.setTextColor(0, 0, 0);

// ===== Important Instructions Section =====
doc.setFontSize(13);
doc.setFont("helvetica", "bold");
doc.text("Important Instructions", 20, 170);

doc.setFont("helvetica", "normal");
doc.setFontSize(11);

const instructions = [
  "• Please arrive at least 15 minutes before your scheduled time.",
  "• Carry a valid ID proof and previous medical records if any.",
  "• Follow hospital safety and hygiene protocols.",
  "• Contact hospital support in case of rescheduling."
];

let yPos = 180;
instructions.forEach(line => {
  doc.text(line, 25, yPos);
  yPos += 7;
});

// ===== Patient Guidelines Section =====
doc.setFontSize(13);
doc.setFont("helvetica", "bold");
doc.text("Patient Guidelines", 20, yPos + 10);

doc.setFont("helvetica", "normal");
doc.setFontSize(11);

const patientGuidelines = [
  "• Arrive at least 15 minutes before your appointment.",
  "• Bring a valid ID proof and previous medical records if any.",
  "• Follow hospital safety and hygiene protocols.",
  "• Maintain silence in waiting areas.",
  "• Contact hospital support for rescheduling or cancellations."
];

yPos += 20;
patientGuidelines.forEach(line => {
  doc.text(line, 25, yPos);
  yPos += 7; // spacing between lines
});

// ===== Hospital Guidelines Section =====
doc.setFontSize(13);
doc.setFont("helvetica", "bold");
doc.text("Hospital Guidelines", 20, yPos + 10);

doc.setFont("helvetica", "normal");
doc.setFontSize(11);

const guidelines = [
  "• Masks are recommended inside hospital premises.",
  "• Follow queue system based on your token number.",
  "• Emergency cases will be prioritized.",
  "• Prescription will be provided after consultation.",
  "• Maintain social distancing and hygiene at all times."
];

yPos += 20;
guidelines.forEach(line => {
  doc.text(line, 25, yPos);
  yPos += 7;
});

// ===== Doctor Signature Section =====
doc.setDrawColor(150);
doc.line(140, yPos + 5, 185, yPos + 5);
doc.setFontSize(10);
doc.text("Authorized Signature", 162, yPos + 12, { align: "center" });

// ===== Hospital Dean Signature Section (Default) =====
doc.setDrawColor(150);
doc.line(30, yPos + 5, 75, yPos + 5);
doc.setFontSize(10);
doc.text("Hospital Dean", 52, yPos + 12, { align: "center" });

// ===== Generated Info =====
doc.setFontSize(9);
doc.setTextColor(120);
doc.text(
  `Generated on: ${new Date().toLocaleString()}`,
  20,
  290
);

doc.setTextColor(0);

// ===== Footer =====
doc.setFillColor(240, 240, 240);
doc.rect(0, 260, 210, 37, "F");

doc.setFontSize(10);
doc.setFont("helvetica", "normal");

doc.text(
  "Clinvero Hospital | 24/7 Emergency Care | Contact: +91 98765 43210",
  105,
  272,
  { align: "center" }
);

doc.text(
  "Address: 123 Health Avenue, Chennai, Tamil Nadu, India",
  105,
  278,
  { align: "center" }
);

doc.text(
  "Email: support@clinvero.com | www.clinvero.com",
  105,
  284,
  { align: "center" }
);

doc.save("Clinvero-Appointment-Confirmation.pdf");
  }}
>
  <Download size={20} />
  Download
</Button>
</div>
      </div>
    </div>
  );
};

export default AppointmentSuccessPage;