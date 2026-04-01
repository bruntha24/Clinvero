export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  doctorName: string;
  doctorLicense?: string;
  specialty?: string;
  clinicName?: string;
  diagnosis: string;
  medications: Medication[];
  additionalNotes?: string;
  date: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  prescriptions?: Prescription[];
}