"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  Edit3,
  Heart,
  Activity,
  Pill,
  Droplets,
  LogOut,
  Check,
  X,
  
  PhoneCall,
  MessageCircle,
  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import ECGPulse from "@/components/ECGPulse";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Download } from "lucide-react";
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route?: string;
  instructions?: string;
}

export interface PrescriptionType {
  id: string;
  doctorName: string;
  doctorLicense?: string;
  specialty?: string;
  clinicName?: string;
  patientName: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: string;
  diagnosis: string;
  medications: Medication[];
  additionalNotes?: string;
  date: string;
}

// Health Stats type
interface HealthStat {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  color: string;
  bg: string;
}

// User type
interface User {
  name: string;
  email?: string;
  mobile?: string;
  image?: string;
  prescriptions?: PrescriptionType[];
}

// ---------- Framer Motion Variants ----------
// ---------- Framer Motion Variants ----------
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 25 } },
};
// ---------- Health Stats ----------
const healthStats: HealthStat[] = [
  { icon: Heart, label: "Heart Rate", value: "72 bpm", color: "text-red-500", bg: "bg-red-100" },
  { icon: Droplets, label: "Blood Type", value: "O+", color: "text-blue-500", bg: "bg-blue-100" },
  { icon: Activity, label: "BP", value: "120/80", color: "text-indigo-500", bg: "bg-indigo-100" },
  { icon: Pill, label: "Allergies", value: "None", color: "text-amber-500", bg: "bg-amber-100" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      const parsed: User = JSON.parse(storedUser);
      setUser(parsed);
      setTempUser(parsed);
      setImagePreview(parsed.image || null);
    }
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && tempUser) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setTempUser({ ...tempUser, image: url });
    }
  };

  const saveEdits = () => {
    if (tempUser) {
      setUser(tempUser);
      localStorage.setItem("userProfile", JSON.stringify(tempUser));
      setEditing(false);
    }
  };

  const cancelEdits = () => {
    if (user) {
      setTempUser(user);
      setEditing(false);
      setImagePreview(user.image || null);
    }
  };

  const deletePrescription = (id: string) => {
    if (!user) return;
    if (!confirm("Do you want to delete this prescription?")) return;

    const updatedPrescriptions = (user.prescriptions || []).filter((p) => p.id !== id);
    const updatedUser = { ...user, prescriptions: updatedPrescriptions };
    setUser(updatedUser);
    localStorage.setItem("userProfile", JSON.stringify(updatedUser));
  };

  if (!user || !tempUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        No user found. Please log in.
      </div>
    );
  }
const downloadPrescriptionPDF = async (p: PrescriptionType) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const teal = rgb(0, 0.5, 0.5);
  const lightTeal = rgb(0.94, 0.98, 0.98);

  const marginX = 50;
  let yPos = height - 50;

  // ---------------- HEADER ----------------
  const headerHeight = 120;
  page.drawRectangle({
    x: 0,
    y: height - headerHeight,
    width,
    height: headerHeight,
    color: teal,
  });

  let yLogo = height - 10;
  const logoUrl = "/hos.png";
  const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(0.18);

  page.drawImage(logoImage, {
    x: width / 2 - logoDims.width / 2,
    y: yLogo - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  });

  let yText = yLogo - logoDims.height - 20;
  page.drawText("CLINVERO HOSPITAL", { x: width / 2 - 120, y: yText, size: 24, font: fontBold, color: rgb(1, 1, 1) });
  yText -= 22;
  page.drawText("Trusted Care. Advanced Treatment. Compassionate Healing.", { x: width / 2 - 180, y: yText, size: 12, font: fontRegular, color: rgb(1, 1, 1) });
  yText -= 14;
  page.drawText("24/7 Emergency | Cardiology | Neurology | General Medicine", { x: width / 2 - 160, y: yText, size: 10, font: fontRegular, color: rgb(1, 1, 1) });
  yPos = height - headerHeight - 50;

  // ---------------- DOCTOR & PATIENT ----------------
  page.drawText("Doctor Information", { x: marginX, y: yPos, size: 14, font: fontBold, color: teal });
  yPos -= 18;
  page.drawText(`Name: ${p.doctorName}`, { x: marginX, y: yPos, size: 12, font: fontRegular });
  yPos -= 18;
  page.drawText(`Specialty: ${p.specialty}`, { x: marginX, y: yPos, size: 12, font: fontRegular });
  yPos -= 18;
  page.drawText(`License No: ${p.doctorLicense}`, { x: marginX, y: yPos, size: 12, font: fontRegular });
  yPos -= 25;

  page.drawText("Patient Details", { x: marginX, y: yPos, size: 14, font: fontBold, color: teal });
  yPos -= 18;
  page.drawText(`Patient Name: ${p.patientName}`, { x: marginX, y: yPos, size: 12, font: fontRegular });
  yPos -= 18;
  page.drawText(`Diagnosis: ${p.diagnosis}`, { x: marginX, y: yPos, size: 12, font: fontRegular });
  yPos -= 25;

  // ---------------- MEDICATIONS ----------------
  page.drawText("Prescribed Medications", { x: marginX, y: yPos, size: 14, font: fontBold, color: teal });
  yPos -= 20;

  const tableX = marginX;
  const tableY = yPos;
  const tableWidth = width - marginX * 2;
  const rowHeight = 25;
  const colWidths = [40, 160, 90, 90, 90];
  let tableHeight = rowHeight;
  p.medications.forEach((m) => { tableHeight += rowHeight; if (m.instructions) tableHeight += 20; });

  page.drawRectangle({ x: tableX, y: tableY - tableHeight, width: tableWidth, height: tableHeight, borderColor: teal, borderWidth: 1.5, color: rgb(0.96, 0.98, 0.98) });

  const headerRowHeight = 28;
  page.drawRectangle({ x: tableX, y: tableY - headerRowHeight, width: tableWidth, height: headerRowHeight, color: rgb(0.88, 0.95, 0.95) });

  let currentY = tableY - headerRowHeight + (headerRowHeight - 12) / 2 + 2;
  const headerLabels = ["No", "Medicine", "Dosage", "Frequency", "Duration"];
  let colX = tableX + 5;
  headerLabels.forEach((label, i) => { page.drawText(label, { x: colX, y: currentY, size: 12, font: fontBold, color: teal }); colX += colWidths[i]; });
  currentY -= headerRowHeight;

  p.medications.forEach((m, idx) => {
    colX = tableX + 5;
    const rowColor = idx % 2 === 0 ? rgb(0.95, 0.98, 0.98) : rgb(0.91, 0.96, 0.96);
    page.drawRectangle({ x: tableX, y: currentY - 2, width: tableWidth, height: rowHeight, color: rowColor });
    page.drawText(`${idx + 1}`, { x: colX, y: currentY, size: 11, font: fontRegular });
    colX += colWidths[0];
    page.drawText(m.name || "-", { x: colX, y: currentY, size: 11, font: fontRegular });
    colX += colWidths[1];
    page.drawText(m.dosage || "-", { x: colX, y: currentY, size: 11, font: fontRegular });
    colX += colWidths[2];
    page.drawText(m.frequency || "-", { x: colX, y: currentY, size: 11, font: fontRegular });
    colX += colWidths[3];
    page.drawText(m.duration || "-", { x: colX, y: currentY, size: 11, font: fontRegular });
    currentY -= rowHeight;

    if (m.instructions) {
      page.drawRectangle({ x: tableX + 5, y: currentY - 2, width: tableWidth - 10, height: 20, borderColor: teal, borderWidth: 0.8, color: rgb(0.90, 0.96, 0.96) });
      page.drawText(`Instructions: ${m.instructions}`, { x: tableX + 10, y: currentY + 2, size: 10, font: fontRegular });
      currentY -= 22;
    }
  });

  yPos = currentY - 10;

  // ---------------- ADDITIONAL NOTES ----------------
  if (p.additionalNotes) {
    page.drawText("Additional Notes:", { x: marginX, y: yPos, size: 13, font: fontBold, color: teal });
    yPos -= 18;
    page.drawText(p.additionalNotes, { x: marginX, y: yPos, size: 11, font: fontRegular });
    yPos -= 25;
  }

  // ---------------- SAVE & DOWNLOAD ----------------
   if (typeof window !== "undefined") {
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" }); // fixed
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Prescription-${p.patientName}.pdf`;
  link.click();
}
};   

  return (
    <div className="min-h-screen bg-blue-50 pb-24">
      {/* HEADER */}
       <motion.div
        className="relative h-72 md:h-96 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-white" />

        {/* ECG Animation */}
        <ECGPulse />

        {/* Back button */}
        <div className="absolute top-0 left-0 p-4 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-blue-700" />
          </motion.button>
        </div>
      </motion.div>
      {/* CONTENT */}
      <div className="relative w-full px-4">
        {/* Avatar */}
        <motion.div
          className="absolute -top-24 left-1/2 -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="relative cursor-pointer">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-36 h-36 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white"
              onClick={() => editing && document.getElementById("avatarInput")?.click()}
            >
              <img
                src={
                  imagePreview ||
                  tempUser.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(tempUser.name)}&background=60a5fa&color=ffffff&size=256`
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {editing && (
              <label
                htmlFor="avatarInput"
                className="absolute bottom-1 right-1 cursor-pointer w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg"
              >
                <Camera size={18} />
              </label>
            )}
            <input type="file" id="avatarInput" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
        </motion.div>
        

        {/* User Info */}
        <div className="pt-28 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 relative">
            {editing ? (
              <input
                value={tempUser.name}
                onChange={(e) => setTempUser({ ...tempUser, name: e.target.value })}
                className="border-b border-blue-300 text-xl font-bold text-blue-900 text-center focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            ) : (
              <h1 className="text-3xl font-bold text-blue-900">{user.name}</h1>
            )}
            <Edit3
              size={18}
              className="text-blue-700 cursor-pointer absolute right-0 -top-1"
              onClick={() => setEditing(!editing)}
            />
          </div>

          {/* Email & Mobile */}
          {editing ? (
            <div className="space-y-2 mt-2">
              <input
                value={tempUser.email}
                onChange={(e) => setTempUser({ ...tempUser, email: e.target.value })}
                className="w-full text-center border-b border-blue-300 text-sm text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <input
                value={tempUser.mobile}
                onChange={(e) => setTempUser({ ...tempUser, mobile: e.target.value })}
                className="w-full text-center border-b border-blue-300 text-sm text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
          ) : (
            <div className="space-y-1 mt-1">
              <p className="text-blue-800 text-sm">{user.email}</p>
              <p className="text-blue-800 text-sm">📱 {user.mobile}</p>
            </div>
          )}

          {/* Save / Cancel buttons */}
          {editing && (
            <div className="flex justify-center gap-2 mt-2">
              <Button
                onClick={saveEdits}
                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm h-9 px-3 rounded-md"
              >
                <Check size={14} /> Save
              </Button>
              <Button
                onClick={cancelEdits}
                className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm h-9 px-3 rounded-md"
              >
                <X size={14} /> Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Health Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full px-24">
  {healthStats.map((stat) => (
    <motion.div
      key={stat.label}
      variants={item}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-2xl p-3 text-center shadow w-full"
    >
      <div
        className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}
      >
        <stat.icon size={20} className={stat.color} />
      </div>
      <p className="text-xs text-blue-800">{stat.label}</p>
      <p className="text-sm font-bold mt-0.5 text-blue-900">{stat.value}</p>
    </motion.div>
  ))}
</motion.div>

{/* Prescriptions - FULL WIDTH CARDS WITH INNER WHITE CONTAINER */}
{user.prescriptions && user.prescriptions.length > 0 && (
  <div className="mt-8 w-full px-6 md:px-12 lg:px-24">
    <h2 className="text-xl font-semibold text-blue-700 mb-4">Prescriptions :</h2>
    <div className="flex flex-col gap-6">
      {user.prescriptions.map((p) => (
        <motion.div
          key={p.id}
          className="relative w-full overflow-hidden rounded-2xl shadow-lg"
          style={{
            backgroundImage: `url('/clinic.avif')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Dim overlay for background */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none rounded-2xl"></div>

          {/* Inner white container */}
          <div className="relative z-10 bg-white/95 rounded-2xl m-4 p-4 sm:p-6 flex flex-col gap-4 shadow">
            
            {/* Header Info: Date & Medications */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
              {/* Date Card */}
<div className="bg-white rounded-xl shadow p-3 flex items-center gap-2 w-max">
  <Activity size={18} className="text-teal-500" />
  <span className="text-sm font-semibold text-gray-700">Date:</span>
  <span className="text-sm text-gray-700">{new Date(p.date).toLocaleString()}</span>
</div>
{/* Centered Logo + Name + Slogan */}
<div className="flex flex-col items-center my-4">
  <img
    src="/hos.png"
    alt="Hospital Logo"
    className="w-16 h-16 object-contain"
  />
  
  <span className="mt-1 text-sm text-gray-600 text-center">
    Caring for your health, every step of the way....Clinvero
  </span>
</div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Pill size={18} className="text-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">Medications:</span>
                <span className="text-sm text-gray-700">{p.medications.length}</span>
              </div>
            </div>
  
            {/* Doctor & Patient Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mt-1 sm:mt-2">
              
              {/* Left: Doctor Card */}
<div className="bg-white rounded-xl shadow p-3 flex flex-col gap-2 w-full max-w-xs">
  <div className="flex items-center gap-1 sm:gap-2">
    <Heart size={18} className="text-red-500" />
    <span className="text-sm font-semibold text-gray-800">Dr Name:</span>
    <span className="text-sm text-gray-800">{p.doctorName}</span>
  </div>
  <div className="flex items-center gap-1 sm:gap-2">
    <Droplets size={18} className="text-blue-500" />
    <span className="text-sm font-semibold text-gray-800">Diagnosis:</span>
    <span className="text-sm text-gray-800">{p.diagnosis}</span>
  </div>
</div>

              {/* Right: Patient */}
              <div className="flex flex-col items-end gap-2">
                {/* Patient Name */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-base font-semibold text-gray-800">Patient Name:</span>
                  <span className="text-base text-gray-700 font-medium">{p.patientName}</span>
                </div>

                {/* Contact & Chat stacked */}
                <div className="flex flex-col gap-2">
                  {/* Contact */}
                  <button className="flex items-center gap-2 p-2 rounded-full bg-green-100 hover:bg-green-200">
                    <PhoneCall size={20} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Contact Hospital</span>
                  </button>

                  {/* Chat */}
                  <button className="flex items-center gap-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200">
                    <MessageCircle size={20} className="text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Chat with Hospital</span>
                  </button>
                    
                </div>
              </div>
            </div>

            {/* Medications & Notes Card */}
<div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
  {/* Medications List */}
  <div className="mt-0">
    <h3 className="flex items-center gap-2 font-semibold text-teal-600 mb-1">
      <Check size={18} /> Medications
    </h3>
    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
      {p.medications.map((m) => (
        <li key={m.id}>
          {m.name} - {m.dosage}, {m.frequency}, {m.duration}{" "}
          {m.instructions && `(Instructions: ${m.instructions})`}
        </li>
      ))}
    </ul>
  </div>

  {/* Additional Notes */}
  {p.additionalNotes && (
    <div className="flex items-start gap-2">
      <Edit3 size={18} className="text-orange-500 mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-gray-700">Notes:</span>
        <span className="text-sm text-gray-700">{p.additionalNotes}</span>
      </div>
    </div>
  )}
</div>
   <Button
  onClick={() => downloadPrescriptionPDF(p)}
  className="w-32 h-10 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl text-sm flex items-center justify-center gap-1"
>
  <Download size={16} />
  Download
</Button>

          </div>
        </motion.div>
      ))}
    </div>
  </div>
)}
 {/* Logout + View Appointments */}
{/* Logout + View Appointments */}
<div className="mt-6 mb-8 flex justify-center gap-6">
  {/* View Appointments - Left */}
  <Button
    onClick={() => router.push("/view-appointment")}
    className="w-52 h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm"
  >
    View Appointments
  </Button>

  {/* Sign Out - Right */}
  <Button
    variant="outline"
    onClick={() => {
      localStorage.removeItem("userProfile");
      router.push("/login");
    }}
    className="w-52 h-14 border-red-400/40 text-red-500 hover:bg-red-50 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2"
  >
    <LogOut size={18} />
    Sign Out
  </Button>
</div>
      </div>

      <BottomNav />
    </div>
  );
}  