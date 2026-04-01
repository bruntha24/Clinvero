"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function OTPClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(55);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestLock = useRef(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  /* ---------------- Timer ---------------- */
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  /* -------- Send OTP ONLY once on mount -------- */
  useEffect(() => {
    if (email) {
      sendOtp();
    }

    inputRefs.current[0]?.focus();
    // eslint-disable-next-line
  }, []);

  /* ---------------- Input Handling ---------------- */
  const handleInput = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---------------- Send OTP ---------------- */
  const sendOtp = async () => {
    if (!email) {
      setError("Email not found.");
      return;
    }

    if (requestLock.current) return;
    requestLock.current = true;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.skipOtp) {
        setMessage("Email already verified. Redirecting...");
        setTimeout(() => router.push("/doctors"), 1500);
        return;
      }

      if (res.ok) {
        setOtpSent(true);
        setTimer(55);
        setMessage("OTP has been sent to your email.");
      } else {
        setError(data.error || "Failed to send OTP.");
        requestLock.current = false;
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
      requestLock.current = false;
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Verify OTP ---------------- */
  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 4) {
      setError("Enter full 4-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOtp }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("OTP verified! Redirecting...");
        setTimeout(() => router.push("/doctors"), 1500);
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
      >
        <img
          src="/heartbeat.gif"
          alt="Doctor"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 via-teal-600/70 to-blue-500/70 backdrop-blur-sm" />
        <div className="relative z-10 text-white text-center px-10">
          <h2 className="text-3xl font-bold mb-3">Secure Verification</h2>
          <p className="text-white/80">
            Enter the 4-digit OTP sent to your email.
          </p>
        </div>
      </motion.div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white shadow-xl rounded-3xl p-8 space-y-6"
        >
          <div className="text-center">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl mb-3 shadow-md">
              🔐
            </div>
            <h1 className="text-2xl font-semibold">Verify OTP</h1>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">
              {message}
            </div>
          )}

          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleInput(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-14 h-14 text-center text-lg border rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">
            {timer > 0
              ? `Resend code in ${timer}s`
              : "Didn't receive the code?"}
          </p>

          <Button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          {timer === 0 && (
            <Button
              onClick={() => {
                requestLock.current = false;
                sendOtp();
              }}
              disabled={loading}
              variant="outline"
              className="w-full border-teal-600 text-teal-600"
            >
              Resend OTP
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}