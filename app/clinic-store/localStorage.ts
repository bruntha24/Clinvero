// ----------------------
// SLOT TYPES
// ----------------------

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: string;      // Added
  gender: string;   // Added
  reason: string;   // Added
  token: number;    // Token starts from 1 per slot
}

export interface Slot {
  id: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  maxPatients: number;
  bookedCount: number;
  patients?: Patient[]; // Store patient info
}

export const getSlots = (): Slot[] => {
  if (typeof window === "undefined") return [];

  return JSON.parse(localStorage.getItem("clinicSlots") || "[]").map(
    (s: any) => ({
      ...s,
      id: String(s.id),
      doctorId: String(s.doctorId),
      patients: s.patients?.map((p: any, index: number) => ({
        ...p,
        token: index + 1, // Ensure token starts from 1
      })) || [],
    })
  );
};

export const saveSlots = (slots: Slot[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("clinicSlots", JSON.stringify(slots));
  }
};

// ----------------------
// APPOINTMENT TYPES
// ----------------------

export interface Appointment {
  id: string;
  patientName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  reason: string;
  date: string;
  time: string;
  type: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  doctorNotes: string;
}

export const getAppointments = (): Appointment[] => {
  if (typeof window === "undefined") return [];

  return JSON.parse(localStorage.getItem("clinicAppointments") || "[]").map(
    (a: any) => ({
      ...a,
      id: String(a.id),
    })
  );
};

export const saveAppointments = (appointments: Appointment[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "clinicAppointments",
      JSON.stringify(appointments)
    );
  }
};

// ----------------------
// DOCTOR AUTH
// ----------------------

export interface DoctorAuth {
  id: string;
  name: string;
  loggedIn: boolean;
}

export const setDoctorAuth = (auth: DoctorAuth) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("doctorAuth", JSON.stringify(auth));
  }
};

export const getDoctorAuth = (): DoctorAuth | null => {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem("doctorAuth");
  return data ? JSON.parse(data) : null;
};

export const logoutDoctor = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("doctorAuth");
  }
};

// ----------------------
// UTILITY: Add patient to a slot
// ----------------------

export const addPatientToSlot = (
  slotId: string,
  patient: Omit<Patient, "token">
): boolean => {
  const slots = getSlots();
  const slot = slots.find((s) => s.id === slotId);

  if (!slot) return false;
  if (!slot.patients) slot.patients = [];

  // Check max patients
  if (slot.patients.length >= slot.maxPatients) return false;

  // Token starts from 1
  const tokenNumber = slot.patients.length + 1;

  slot.patients.push({ ...patient, token: tokenNumber });
  slot.bookedCount = slot.patients.length;

  saveSlots(slots);
  return true;
};