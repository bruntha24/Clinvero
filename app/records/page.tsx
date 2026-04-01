"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/lib/patient";
import { patients as defaultPatients } from "@/lib/patient";
import { ArrowLeft, Upload, Save, Heart, Activity, Pill, Thermometer, Stethoscope, Syringe, Brain,User, Droplets, BedDouble, CalendarCheck } from "lucide-react";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const DEPARTMENTS = ["ICU", "Cardiology", "Neurology", "Pediatrics", "Oncology", "Orthopedics", "Dermatology"];
const SEX_TYPES = ["Male", "Female", "Other"];
const STATUS_TYPES = ["Active", "Critical", "Recovered", "Under Treatment"];
const icons = [Heart, Activity, Pill, Thermometer, Stethoscope, Syringe, Brain];

export default function RecordsPage() {
  const router = useRouter();

  // Login states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added loading state

  // Staff info
  const [role, setRole] = useState<"doctor" | "nurse" | "admin">("doctor");
  const [staffName, setStaffName] = useState("");

  // Patients
  const [patients, setPatients] = useState<Patient[]>([]);
  const [newPatient, setNewPatient] = useState<Patient>({
    id: Date.now(),
    name: "",
    email: "",
    image: "/patients/default.jpg",
    sex: "Male",
    age: 0,
    blood: "O+",
    status: "Active",
    department: "",
    registeredDate: new Date().toISOString().split("T")[0],
    appointment: 0,
    bedNumber: "",
    vitals: {
      bloodPressure: { value: "", status: "In the norm", type: "normal" },
      heartRate: { value: "", status: "In the norm", type: "normal" },
      glucose: { value: "", status: "In the norm", type: "normal" },
      cholesterol: { value: "", status: "In the norm", type: "normal" }
    },
    totalVisits: 0,
    history: [
      {
        date: new Date().toISOString().split("T")[0],
        diagnosis: "",
        severity: "Normal",
        severityType: "normal",
        visits: 0,
        status: "Under Treatment",
        statusType: "treatment"
      }
    ]
  });

  // Load patients from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("patients");
    if (stored) {
      setPatients(JSON.parse(stored));
    } else {
      setPatients(defaultPatients);
      localStorage.setItem("patients", JSON.stringify(defaultPatients));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  // Floating icon positions
  const [iconPositions, setIconPositions] = useState<{ top: number; left: number; duration: number; delay: number }[]>([]);
  useEffect(() => {
    const positions = icons.map((_, i) => ({
      top: Math.random() * 70 + 15,
      left: Math.random() * 70 + 15,
      duration: 5 + i * 2,
      delay: i * 0.5
    }));
    setIconPositions(positions);
  }, []);

  // Login handler with loading
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (loginData.email === "clinvero24@gmail.com" && loginData.password === "Karthi@17") {
        setIsLoggedIn(true);
        setLoginError("");
      } else {
        setLoginError("Invalid Credentials ❌");
      }
      setLoading(false);
    }, 1000); // simulate delay
  };

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setNewPatient({ ...newPatient, image: reader.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Add new patient
  const addNewPatient = () => {
    setPatients([...patients, { ...newPatient, id: Date.now() }]);
    alert("Patient saved successfully ✅");

    // Reset form
    setNewPatient({
      ...newPatient,
      id: Date.now(),
      name: "",
      email: "",
      image: "/patients/default.jpg",
      sex: "Male",
      age: 0,
      blood: "O+",
      status: "Active",
      department: "",
      registeredDate: new Date().toISOString().split("T")[0],
      appointment: 0,
      bedNumber: "",
      totalVisits: 0,
      vitals: {
        bloodPressure: { value: "", status: "In the norm", type: "normal" },
        heartRate: { value: "", status: "In the norm", type: "normal" },
        glucose: { value: "", status: "In the norm", type: "normal" },
        cholesterol: { value: "", status: "In the norm", type: "normal" }
      },
      history: [
        {
          date: new Date().toISOString().split("T")[0],
          diagnosis: "",
          severity: "Normal",
          severityType: "normal",
          visits: 0,
          status: "Under Treatment",
          statusType: "treatment"
        }
      ]
    });
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-teal-50">
      {/* Floating Medical Icons */}
      {iconPositions.length > 0 &&
        icons.map((Icon, i) => (
          <Icon
            key={i}
            className={`absolute w-6 h-6 text-teal-500 opacity-60 animate-float-${i % 5}`}
            style={{
              top: `${iconPositions[i].top}%`,
              left: `${iconPositions[i].left}%`,
              animationDuration: `${iconPositions[i].duration}s`,
              animationDelay: `${iconPositions[i].delay}s`,
            }}
          />
        ))}

      {/* Pulsing Concentric Rings */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border-2 border-teal-700 opacity-70 pointer-events-none"
          style={{
            width: `${280 + i * 120}px`,
            height: `${280 + i * 120}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: `pulse-ring 2.5s ease-out ${i * 0.5}s infinite`,
          }}
        />
      ))}

      {/* Orbiting Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-teal-600 pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transformOrigin: `${120 + i * 20}px 0`,
            animation: `orbit ${6 + i * 1.5}s linear ${i * 0.3}s infinite`,
            boxShadow: `0 0 12px rgba(56,189,248,${0.5 + i * 0.1})`,
          }}
        />
      ))}

      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-96">
        <div className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl p-8 flex flex-col items-center animate-fade-in border border-teal-400/40">

          {/* Heartbeat Logo */}
          <div className="w-16 h-16 rounded-xl bg-teal-400 flex items-center justify-center mb-4 relative animate-heartbeat">
            <Heart className="w-7 h-7 text-white" />
            <div
              className="absolute inset-0 rounded-xl bg-teal-400/40"
              style={{ animation: "ping-slow 1.8s ease-out infinite" }}
            />
          </div>

          {/* Logo Text */}
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 animate-text-shimmer">
            Clinvero
          </h2>

          {/* ECG Line */}
          <div className="mb-6 w-full h-10 overflow-hidden flex items-center">
            <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="none">
              <path
                d="M0,20 L60,20 L70,20 L80,2 L90,38 L100,8 L110,32 L120,20 L180,20 L190,20 L200,2 L210,38 L220,8 L230,32 L240,20 L300,20 L310,20 L320,2 L330,38 L340,8 L350,32 L360,20 L400,20"
                fill="none"
                stroke="hsl(174, 79%, 44%)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 800,
                  strokeDashoffset: 800,
                  animation: "ecg-draw 2s ease-in-out forwards, ecg-repeat 2.5s linear 2.8s infinite",
                  opacity: 1,
                  filter: "drop-shadow(0 0 6px hsl(174, 79%, 44%))",
                }}
              />
              <rect
                x="0"
                y="0"
                width="3"
                height="40"
                fill="hsl(174, 79%, 44%, 0.9)"
                style={{ animation: "scan-line 2.5s linear 2.8s infinite" }}
              />
            </svg>
          </div>

          {/* Inputs */}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition animate-slide-in-left"
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition animate-slide-in-right"
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          {loginError && <p className="text-red-500 text-sm mb-2 text-center">{loginError}</p>}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-xl bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-500 transition transform hover:scale-105 relative overflow-hidden flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{loading ? "Logging in..." : "Login"}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 skew-x-12" />
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease forwards; }

        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.15); }
        }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }

        @keyframes ping-slow { 0%{opacity:0.7;transform:scale(1);} 100%{opacity:0;transform:scale(2);} }

        @keyframes text-shimmer { 0%,100%{opacity:1;} 50%{opacity:0.7; filter: brightness(1.2);} }
        .animate-text-shimmer { animation: text-shimmer 2s infinite; }

        @keyframes slide-in-left { 0% { opacity:0; transform: translateX(-30px); } 100% { opacity:1; transform: translateX(0); } }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease forwards; }

        @keyframes slide-in-right { 0% { opacity:0; transform: translateX(30px); } 100% { opacity:1; transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease forwards; }

        @keyframes pulse-ring { 0% { opacity:0.7; transform: scale(0.8);} 100% { opacity:0; transform: scale(1.4);} }

        @keyframes orbit { 0% { transform: rotate(0deg) translateX(var(--orbit-radius,150px)); } 100% { transform: rotate(360deg) translateX(var(--orbit-radius,150px)); } }

        @keyframes ecg-draw { to { stroke-dashoffset:0; } }
        @keyframes ecg-repeat { 0%{stroke-dashoffset:0;} 100%{stroke-dashoffset:-800;} }
        @keyframes scan-line { 0%{x:0;opacity:0;} 5%{opacity:1;} 95%{opacity:1;} 100%{x:400;opacity:0;} }
      `}</style>
    </div>
  );
}
  // RECORDS PAGE
// RECORDS PAGE
return (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white pb-12">

    {/* Header */}
    <header className="bg-white/80 backdrop-blur-md border-b border-teal-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/records")}
          className="p-2 rounded-full border border-teal-200 hover:border-teal-500 hover:bg-teal-50 transition"
        >
          <ArrowLeft className="w-4 h-4 text-teal-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Patient Records</h1>
      </div>
    </header>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-6">

      {/* Staff Info */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Enter Staff Name"
          value={staffName}
          onChange={(e) => setStaffName(e.target.value)}
          className="flex-1 px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "doctor" | "nurse" | "admin")}
          className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
        >
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Patient Form Card */}
      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6 border border-teal-100">

        <h2 className="text-2xl font-bold text-gray-800">Add / Edit Patient</h2>

        {/* Image Upload */}
        <div className="flex items-center gap-6">
          {newPatient.image && (
            <img
              src={newPatient.image}
              alt="Patient"
              className="w-24 h-24 rounded-2xl object-cover border border-teal-200 shadow"
            />
          )}
          <label className="cursor-pointer px-4 py-2 rounded-2xl border border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-500 transition flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <input
            placeholder="Name"
            value={newPatient.name}
            onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
          />

          <input
            placeholder="Email"
            value={newPatient.email}
            onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
          />

     <select
  value={newPatient.sex}
  onChange={(e) => setNewPatient({ ...newPatient, sex: e.target.value })}
  className="px-4 py-2 rounded-2xl border border-teal-300 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200 bg-white text-gray-800"
  style={{
    // Rounded corners of dropdown menu when open (browser dependent)
    borderRadius: "0.75rem", // matches rounded-2xl
  }}
>
  {SEX_TYPES.map((s) => (
    <option
      key={s}
      value={s}
      style={{
        backgroundColor: "white", // normal background
        color: "teal",           // normal text
      }}
    >
      {s}
    </option>
  ))}
</select>
          <select
  value={newPatient.blood}
  onChange={(e) => setNewPatient({ ...newPatient, blood: e.target.value })}
  className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition text-black bg-white"
>
  {BLOOD_TYPES.map((b) => (
    <option
      key={b}
      value={b}
      style={{
        color: "#0d9488", // Tailwind teal-600 for dropdown options
      }}
    >
      {b}
    </option>
  ))}
</select>
          <select
  value={newPatient.status}
  onChange={(e) => setNewPatient({ ...newPatient, status: e.target.value })}
  className="px-4 py-2 rounded-2xl border border-gray-300 
             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 
             outline-none transition text-black bg-white"
>
  {STATUS_TYPES.map((s) => (
    <option
      key={s}
      value={s}
      style={{
        color: "#0d9488", // Tailwind teal-600 for dropdown options
      }}
    >
      {s}
    </option>
  ))}
</select>

          <select
  value={newPatient.department}
  onChange={(e) => setNewPatient({ ...newPatient, department: e.target.value })}
  className="px-4 py-2 rounded-2xl border border-gray-300 
             focus:border-teal-500 focus:ring-2 focus:ring-teal-200 
             outline-none transition text-black bg-white"
>
  <option value="" style={{ color: "#000000" }}>Select Department</option>
  {DEPARTMENTS.map((d) => (
    <option
      key={d}
      value={d}
      style={{
        color: "#0d9488", // Tailwind teal-600 for dropdown options
      }}
    >
      {d}
    </option>
  ))}
</select>

          <input
            type="date"
            value={newPatient.registeredDate}
            onChange={(e) => setNewPatient({ ...newPatient, registeredDate: e.target.value })}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
          />
           <input
            placeholder="Bed Number"
            value={newPatient.bedNumber}
            onChange={(e) => setNewPatient({ ...newPatient, bedNumber: e.target.value })}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
          />

<div className="col-span-full">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

   <div className="flex flex-col gap-1">
     <label className="text-sm font-semibold text-gray-600">
       Appointment : </label> 
       <input type="number" value={newPatient.appointment} onChange={(e) =>
         setNewPatient({ ...newPatient, appointment: Number(e.target.value), }) } 
         className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition" /> </div>
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">
        Age :
      </label>
      <input
        type="number"
        value={newPatient.age}
        onChange={(e) =>
          setNewPatient({ ...newPatient, age: Number(e.target.value) })
        }
        className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
      />
    </div>

    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-600">
        Total Visits :
      </label>
      <input
        type="number"
        value={newPatient.totalVisits}
        onChange={(e) =>
          setNewPatient({
            ...newPatient,
            totalVisits: Number(e.target.value),
          })
        }
        className="px-4 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
      />
    </div>

  </div>
</div>
        </div>
        {/* Vitals */}
        <h3 className="text-lg font-semibold text-gray-700 mt-6">Vitals</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {(["bloodPressure", "heartRate", "glucose", "cholesterol"] as const).map((vital) => (
            <div key={vital} className="grid grid-cols-2 gap-2">
              <input
                placeholder={`${vital} Value`}
                value={newPatient.vitals[vital].value}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    vitals: {
                      ...newPatient.vitals,
                      [vital]: {
                        ...newPatient.vitals[vital],
                        value: e.target.value
                      }
                    }
                  })
                }
                className="px-3 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
              />
              <select
                value={newPatient.vitals[vital].status}
                onChange={(e) =>
                  setNewPatient({
                    ...newPatient,
                    vitals: {
                      ...newPatient.vitals,
                      [vital]: {
                        ...newPatient.vitals[vital],
                        status: e.target.value
                      }
                    }
                  })
                }
                className="px-3 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
              >
                <option value="Low">Low</option>
                <option value="In the norm">In the norm</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          ))}
        </div>

        {/* Medical History */}
        <h3 className="text-lg font-semibold text-gray-700 mt-6">Medical History</h3>

        {newPatient.history.map((h, idx) => (
          <div key={idx} className="border border-teal-100 rounded-2xl p-4 space-y-3 bg-teal-50/40">
            
            <input
              type="date"
              value={h.date}
              onChange={(e) => {
                const newHistory = [...newPatient.history];
                newHistory[idx].date = e.target.value;
                setNewPatient({ ...newPatient, history: newHistory });
              }}
              className="w-full px-3 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
            />

            <input
              placeholder="Diagnosis"
              value={h.diagnosis}
              onChange={(e) => {
                const newHistory = [...newPatient.history];
                newHistory[idx].diagnosis = e.target.value;
                setNewPatient({ ...newPatient, history: newHistory });
              }}
              className="w-full px-3 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
            />

            <input
              placeholder="Severity"
              value={h.severity}
              onChange={(e) => {
                const newHistory = [...newPatient.history];
                newHistory[idx].severity = e.target.value;
                setNewPatient({ ...newPatient, history: newHistory });
              }}
              className="w-full px-3 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
            />
           <label className="text-sm font-medium text-gray-600 mb-1 ml-2">
  Visits :
</label>
            <input
              type="number"
              placeholder="Visits"
              value={h.visits}
              onChange={(e) => {
                const newHistory = [...newPatient.history];
                newHistory[idx].visits = Number(e.target.value);
                setNewPatient({ ...newPatient, history: newHistory });
              }}
              className="w-full px-3 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
            />

            <select
              value={h.status}
              onChange={(e) => {
                const newHistory = [...newPatient.history];
                newHistory[idx].status = e.target.value;
                setNewPatient({ ...newPatient, history: newHistory });
              }}
              className="w-full px-3 py-2 rounded-2xl border border-gray-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition"
            >
              <option value="Under Treatment">Under Treatment</option>
              <option value="Cured">Cured</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        ))}

        {/* Add History Button */}
        <button
          onClick={() =>
            setNewPatient({
              ...newPatient,
              history: [
                ...newPatient.history,
                {
                  date: new Date().toISOString().split("T")[0],
                  diagnosis: "",
                  severity: "Normal",
                  severityType: "normal",
                  visits: 0,
                  status: "Under Treatment",
                  statusType: "treatment"
                }
              ]
            })
          }
          className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-2xl shadow transition"
        >
          Add History Entry
        </button>

        {/* Save Button */}
        <button
          onClick={addNewPatient}
          className="bg-teal-700 hover:bg-teal-600 text-white px-8 py-3 rounded-2xl shadow-lg transition transform hover:scale-105 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Patient
        </button>

      </div>
 
  
{/* Heading */}
<div className="bg-teal-50 p-6 rounded-2xl shadow-sm">
  <h1 className="text-2xl sm:text-3xl font-extrabold text-teal-900 tracking-tight">
    Patient Records
  </h1>
  <p className="text-teal-800/70 text-sm mt-0.5">
  {patients.length} registered patients 
  <span className="mx-6">•...</span>
  <span>Hospital Management System</span>
</p>
</div>


{/* Patient Cards */}
<div className="flex flex-col gap-2">
  {patients.map((p) => (
    <div
      key={p.id}
      className="bg-white rounded-2xl shadow-md border border-teal-100 flex items-center gap-4 p-4 transition hover:shadow-lg hover:scale-[1.01] w-full"
      style={{ minHeight: "80px" }}
    >
      {/* Patient Image */}
      {p.image && (
        <img
          src={p.image}
          alt={p.name}
          className="w-16 h-16 rounded-xl object-cover border border-teal-200 shadow flex-shrink-0"
        />
      )}

      {/* Patient Info - fill entire width */}
      <div className="flex-1 flex flex-row flex-wrap items-center gap-4 justify-between min-w-0">
        <div className="flex-1 min-w-[120px]">
          <h3 className="text-lg font-bold truncate">{p.name}</h3>
          <p className="text-sm truncate">{p.department}</p>
        </div>

        <p className="text-sm font-medium">
          Status: <span className="text-teal-600">{p.status}</span>
        </p>

        <div className="flex flex-row flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4 text-teal-600" /> {p.age} yrs
          </span>
          <span className="flex items-center gap-1">
            <Droplets className="w-4 h-4 text-red-500" /> {p.blood}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="w-4 h-4 text-primary" /> {p.bedNumber}
          </span>
          <span className="flex items-center gap-1">
            <CalendarCheck className="w-4 h-4 text-green-500" /> {p.totalVisits} visits
          </span>
        </div>

        
        {/* Actions */}
<div className="flex gap-2 flex-shrink-0">
  <button
    onClick={() => router.push(`/records/${p.id}`)}
    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
  >
    View
  </button>

  {(role === "doctor" || role === "admin") && (
    <button
      onClick={() => {
        const confirmDelete = confirm(`Do you want to delete ${p.name}?`);
        if (confirmDelete) {
          setPatients(
            patients.filter((patient) => patient.id !== p.id)
          );
        }
      }}
      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
    >
      Delete
    </button>
  )}
  {(role === "admin") && (
    <button
      onClick={() => {
        const confirmDelete = confirm(`Do you want to delete ${p.name}?`);
        if (confirmDelete) {
          setPatients(
            patients.filter((patient) => patient.id !== p.id)
          );
        }
      }}
      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
    >
      Delete
    </button>
  )}
  
    </div>
      </div>
    </div>
  ))}
</div>
</div>
    </div>
  );
}