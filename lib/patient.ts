export interface Patient {
  id: number;
  name: string;
  email: string;
  image: string;
  sex: string;
  age: number;
  blood: string;
  status: string;
  department: string;
  registeredDate: string;
  appointment: number;
  bedNumber: string;
  vitals: {
    bloodPressure: {
      value: string;
      status: string;
      type: string;
    };
    heartRate: {
      value: string;
      status: string;
      type: string;
    };
    glucose: {
      value: string;
      status: string;
      type: string;
    };
    cholesterol: {
      value: string;
      status: string;
      type: string;
    };
  };
  totalVisits: number;
  history: {
    date: string;
    diagnosis: string;
    severity: string;
    severityType: string;
    visits: number;
    status: string;
    statusType: string;
  }[];
}

// ✅ Add this
export const patients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    image: "/patients/john.jpg",
    sex: "Male",
    age: 45,
    blood: "A+",
    status: "Stable",
    department: "Cardiology",
    registeredDate: "2024-01-10",
    appointment: 3,
    bedNumber: "B12",
    vitals: {
      bloodPressure: { value: "120/80", status: "Normal", type: "bp" },
      heartRate: { value: "72", status: "Normal", type: "hr" },
      glucose: { value: "95", status: "Normal", type: "glucose" },
      cholesterol: { value: "180", status: "Borderline", type: "chol" }
    },
    totalVisits: 5,
    history: []
  }
];