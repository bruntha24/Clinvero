"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, ShieldCheck, Lock } from "lucide-react";
import { doctors } from "@/lib/mock-data";
import { setDoctorAuth, getDoctorAuth } from "@/app/clinic-store/localStorage";

export default function DoctorLogin() {
  const router = useRouter();
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0].id);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false); // <-- dropdown state

  // Check if doctor is already logged in
  useEffect(() => {
    const auth = getDoctorAuth();
    if (auth && auth.loggedIn) {
      router.replace("/clinic-doctor/manage-schedule");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const selectedDoctor = doctors.find((doc) => String(doc.id) === String(selectedDoctorId));

    setTimeout(() => {
      if (password.trim() === "Karthi@17" && selectedDoctor) {
        setDoctorAuth({
          id: String(selectedDoctor.id),
          name: selectedDoctor.name,
          loggedIn: true,
        });
        router.replace("/clinic-doctor/manage-schedule");
      } else {
        setError("Invalid password");
      }
      setLoading(false);
    }, 500);
  };

  if (checkingAuth) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #D0F0F5, #E6F3FF)" }}
    >
      {/* Floating medical icons */}
      {[...Array(6)].map((_, i) => {
        const colors = ["#81E6D9", "#B2F5EA", "#C3F0F5", "#A0E7E5", "#B5D9F7", "#AFE9F0"];
        return (
          <motion.div
            key={i}
            className="absolute opacity-30"
            style={{ top: `${15 + i * 15}%`, left: `${5 + i * 16}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
          >
            <Stethoscope className="w-12 h-12" style={{ color: colors[i % colors.length] }} />
          </motion.div>
        );
      })}

      {/* DNA Helix dots */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: `${10 + (i % 6) * 15}%`,
            right: `${5 + Math.floor(i / 6) * 8}%`,
            backgroundColor: "#B5F0FF",
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Form card */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl" style={{ background: "rgba(255,255,255,0.35)" }}>
          
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          >
            <motion.div
              className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#A0E7E5] to-[#B5F0FF] mx-auto flex items-center justify-center mb-4 shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Stethoscope className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Clinvero</h1>
            <p className="text-gray-700 mt-1 text-sm">Doctor Portal</p>
          </motion.div>

          {/* Heartbeat Line */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <HeartbeatLine />
          </motion.div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5 mt-4">
            {/* Custom Animated Dropdown */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="relative w-full">
              {/* Selected Doctor Box */}
              <div
                onClick={() => setOpen(!open)}
                className="cursor-pointer w-full bg-white/60 backdrop-blur-md rounded-lg py-2 px-3 flex justify-between items-center shadow-md hover:shadow-xl transition-shadow"
              >
                <span className="text-gray-900">
                  {doctors.find(doc => doc.id === selectedDoctorId)?.name} – {doctors.find(doc => doc.id === selectedDoctorId)?.specialty}
                </span>
                <motion.span
                  animate={{ rotate: open ? 180 : 0 }}
                  className="inline-block text-gray-600"
                >
                  ▼
                </motion.span>
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {open && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white/70 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200"
                  >
                    {doctors.map((doc) => (
                      <motion.li
                        key={doc.id}
                        onClick={() => {
                          setSelectedDoctorId(doc.id);
                          setOpen(false);
                        }}
                        whileHover={{ scale: 1.03, backgroundColor: "#B5F0FF" }}
                        className="cursor-pointer px-4 py-2 text-gray-900 rounded-lg transition-colors"
                      >
                        {doc.name} – {doc.specialty}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/50 text-gray-900 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </motion.div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Submit */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-gray-900 font-semibold h-12 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #A0E7E5, #B5F0FF)" }}
              >
                <ShieldCheck className="w-5 h-5 text-gray-900" /> {loading ? "Signing in..." : "Sign In"}
              </button>
            </motion.div>
          </form>

          <motion.p className="text-center text-xs text-gray-700 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Demo Password: Karthi@17
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

// Heartbeat Line Component
const HeartbeatLine = () => {
  const path = "M0,50 L20,50 L25,50 L30,20 L35,80 L40,50 L45,50 L50,50 L55,45 L60,55 L65,50 L80,50 L85,50 L90,15 L95,85 L100,50 L105,50 L120,50";

  return (
    <svg viewBox="0 0 120 100" className="w-full h-16 opacity-40" preserveAspectRatio="none">
      <motion.path
        d={path}
        fill="none"
        stroke="#81E6D9"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
};