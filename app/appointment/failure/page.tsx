"use client";

import { motion } from "framer-motion";
import { XCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { doctors } from "@/lib/mock-data";

export default function AppointmentFailurePage() {
  const router = useRouter();
  const doctor = doctors[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 max-w-lg mx-auto">
      {/* Failure Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mb-6"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
          <XCircle size={48} className="text-destructive" />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-foreground mb-2"
      >
        Unable to Book
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full glass-card rounded-3xl p-5 mt-6 space-y-4"
      >
        <div className="flex items-center gap-4">
          <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-2xl object-cover" />
          <div>
            <h3 className="font-semibold text-foreground">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
          </div>
        </div>

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [0, -5, 5, -5, 5, 0] }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertTriangle size={20} className="text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground">
            Sorry, the appointment slot/consulting time is over. Please try booking for a different time or date.
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="w-full mt-6 space-y-3"
      >
        <button
          onClick={() => router.push("/appointment")}
          className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold btn-press shadow-lg shadow-primary/25"
        >
          Try Another Slot
        </button>
        <button
          onClick={() => router.push("/appointment")}
          className="w-full py-4 rounded-2xl glass-card text-foreground font-semibold btn-press flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}