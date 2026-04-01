"use client";
import { useState, useCallback } from "react";
import { Plus, Send, Trash2, X } from "lucide-react";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
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

export interface User {
  id: number;
  name: string;
  email?: string;
  mobile?: string;
  prescriptions?: PrescriptionType[];
}

const MedicationRow = ({
  medication,
  index,
  canRemove,
  onChange,
  onRemove,
}: {
  medication: Medication;
  index: number;
  canRemove: boolean;
  onChange: (id: string, field: keyof Medication, value: string) => void;
  onRemove: (id: string) => void;
}) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-700">
        Medication #{index + 1}
      </span>
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(medication.id)}
          className="text-red-500 hover:bg-red-100 p-1 rounded"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <label className="text-xs font-medium mb-1 block">Drug Name *</label>
        <input
          type="text"
          placeholder="e.g. Amoxicillin"
          value={medication.name}
          onChange={(e) => onChange(medication.id, "name", e.target.value)}
          className="w-full border rounded-md px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="text-xs font-medium mb-1 block">Dosage *</label>
        <input
          type="text"
          placeholder="e.g. 500mg"
          value={medication.dosage}
          onChange={(e) => onChange(medication.id, "dosage", e.target.value)}
          className="w-full border rounded-md px-3 py-2 bg-white"
        />
      </div>
      <div>
        <label className="text-xs font-medium mb-1 block">Route</label>
        <select
          value={medication.route}
          onChange={(e) => onChange(medication.id, "route", e.target.value)}
          className="w-full border rounded-md px-3 py-2 bg-white"
        >
          <option value="">Select route</option>
          <option value="oral">Oral</option>
          <option value="topical">Topical</option>
          <option value="iv">Intravenous (IV)</option>
          <option value="im">Intramuscular (IM)</option>
          <option value="subcutaneous">Subcutaneous</option>
          <option value="inhalation">Inhalation</option>
          <option value="rectal">Rectal</option>
          <option value="ophthalmic">Ophthalmic</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium mb-1 block">Frequency *</label>
        <select
          value={medication.frequency}
          onChange={(e) =>
            onChange(medication.id, "frequency", e.target.value)
          }
          className="w-full border rounded-md px-3 py-2 bg-white"
        >
          <option value="">Select frequency</option>
          <option value="od">Once daily (OD)</option>
          <option value="bd">Twice daily (BD)</option>
          <option value="tid">Three times daily (TID)</option>
          <option value="qid">Four times daily (QID)</option>
          <option value="prn">As needed (PRN)</option>
          <option value="stat">Immediately (STAT)</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium mb-1 block">Duration *</label>
        <input
          type="text"
          placeholder="e.g. 7 days"
          value={medication.duration}
          onChange={(e) => onChange(medication.id, "duration", e.target.value)}
          className="w-full border rounded-md px-3 py-2 bg-white"
        />
      </div>
      <div className="md:col-span-2">
        <label className="text-xs font-medium mb-1 block">Special Instructions</label>
        <input
          type="text"
          placeholder="e.g. Take after meals"
          value={medication.instructions}
          onChange={(e) =>
            onChange(medication.id, "instructions", e.target.value)
          }
          className="w-full border rounded-md px-3 py-2 bg-white"
        />
      </div>
    </div>
  </div>
);

const createEmptyMedication = (): Medication => ({
  id: crypto.randomUUID(),
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  route: "",
  instructions: "",
});

interface Props {
  onClose: () => void;
}

const Prescription = ({ onClose }: Props) => {
  // Doctor Info
  const [doctorName, setDoctorName] = useState("");
  const [doctorLicense, setDoctorLicense] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [clinicName, setClinicName] = useState("");

  // Patient Info
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState(""); // <-- email field
  const [patientAge, setPatientAge] = useState<number | "">("");
  const [patientGender, setPatientGender] = useState("");

  // Diagnosis & Medications
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState<Medication[]>([createEmptyMedication()]);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleMedicationChange = useCallback(
    (id: string, field: keyof Medication, value: string) => {
      setMedications((prev) =>
        prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
      );
    },
    []
  );

  const addMedication = () => setMedications((prev) => [...prev, createEmptyMedication()]);
  const removeMedication = (id: string) =>
    setMedications((prev) => prev.filter((m) => m.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !patientName.trim() || !patientEmail.trim()) {
      setMessage("Please fill in Doctor Name, Patient Name, and Patient Email.");
      return;
    }

    // Validate medications
    for (const med of medications) {
      if (!med.name || !med.dosage || !med.frequency || !med.duration) {
        setMessage("Please fill in all required fields for medications.");
        return;
      }
    }

    setIsSubmitting(true);
    setMessage("");

    const storedProfile = localStorage.getItem("userProfile");
    let profile: User = storedProfile
      ? JSON.parse(storedProfile)
      : { id: Date.now(), name: patientName, prescriptions: [] };

    const newPrescription: PrescriptionType = {
      id: crypto.randomUUID(),
      doctorName,
      doctorLicense,
      specialty,
      clinicName,
      patientName,
      patientEmail,
      patientAge: patientAge === "" ? undefined : Number(patientAge),
      patientGender: patientGender || undefined,
      diagnosis,
      medications: medications.map((m) => ({ ...m })),
      additionalNotes,
      date: new Date().toISOString(),
    };

    profile.prescriptions = [...(profile.prescriptions || []), newPrescription];
    localStorage.setItem("userProfile", JSON.stringify(profile));

    // ---------------- Send Prescription Email ----------------
    const prescriptionHtml = `
      <h2>Prescription from Dr. ${doctorName}</h2>
      <p><strong>Patient:</strong> ${patientName}</p>
      <p><strong>Diagnosis:</strong> ${diagnosis}</p>
      <h3>Medications:</h3>
      <ul>
        ${medications
          .map(
            (m) =>
              `<li>${m.name} - ${m.dosage}, ${m.frequency}, ${m.duration} ${
                m.instructions ? `(Instructions: ${m.instructions})` : ""
              }</li>`
          )
          .join("")}
      </ul>
      <p><strong>Additional Notes:</strong> ${additionalNotes}</p>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    `;

    try {
      await fetch("/api/send-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: patientEmail,
          patientName,
          doctorName,
          prescriptionHtml,
        }),
      });
      console.log("Prescription sent to patient email");
    } catch (err) {
      console.error("Failed to send prescription email:", err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("Prescription saved and sent to patient's email!");
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          {/* Doctor Info */}
          <h2 className="text-xl font-semibold text-teal-700">Doctor Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Doctor Name *"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <input
              placeholder="License Number"
              value={doctorLicense}
              onChange={(e) => setDoctorLicense(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <input
              placeholder="Specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <input
              placeholder="Clinic / Hospital"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
          </div>

          {/* Patient Info */}
          <h2 className="text-xl font-semibold text-teal-700">Patient Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Patient Name *"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <input
              placeholder="Patient Email *"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
            <input
              type="number"
              placeholder="Age"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value === "" ? "" : Number(e.target.value))}
              className="border rounded-md px-3 py-2"
            />
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Diagnosis */}
          <div className="mt-4">
            <input
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-teal-700">Medications</h2>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center gap-1 text-sm border px-3 py-1 rounded-md hover:bg-teal-100 text-teal-700"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            {medications.map((med, idx) => (
              <MedicationRow
                key={med.id}
                medication={med}
                index={idx}
                canRemove={medications.length > 1}
                onChange={handleMedicationChange}
                onRemove={removeMedication}
              />
            ))}
          </div>

          {/* Additional Notes */}
          <div>
            <h2 className="text-xl font-semibold text-teal-700 mb-1">Additional Notes</h2>
            <textarea
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {message && <p className="text-sm text-teal-600">{message}</p>}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2 rounded-md hover:bg-teal-700"
            >
              <Send size={16} /> {isSubmitting ? "Submitting..." : "Share Prescription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Prescription;