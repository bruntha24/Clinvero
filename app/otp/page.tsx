"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleInput = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
{/* ================= LEFT IMAGE PANEL ================= */}
<motion.div
  initial={{ opacity: 0, x: -60 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
>
  <motion.img
    src="/media.avif"
    alt="Heartbeat"
    initial={{ scale: 1.1 }}
    animate={{ scale: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Optional subtle overlay for premium look */}
  <div className="absolute inset-0 bg-black/20" />
</motion.div>
      {/* ================= RIGHT OTP PANEL ================= */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md space-y-6 text-center">

          <h1 className="text-2xl font-semibold">
            OTP Verification
          </h1>

          <p className="text-sm text-gray-500">
            Code sent to +91 ******99
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                onChange={(e) =>
                  handleInput(e.target.value, index)
                }
                maxLength={1}
                className="w-14 h-14 text-center text-lg border rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            ))}
          </div>

          <p className="text-sm text-gray-400">
            Resend code in 55s
          </p>

          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            Verify
          </Button>

        </div>
      </motion.div>
    </div>
  );
}