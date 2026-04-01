"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Smartphone } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState(""); // ✅ Added mobile state
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const doctorId = "1";

  const handleAuth = async () => {
    setError("");

    // ✅ Validate all required fields including mobile for signup
    if (!email || !password || (isSignup && (!name || !mobile))) {
      setError("Please fill all required fields.");
      return;
    }

    // ✅ Optional: simple mobile number validation
    if (isSignup && !/^\d{10}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Store user data locally
      const userData = {
        name: isSignup ? name : "",
        email,
        mobile: isSignup ? mobile : "",
      };

      localStorage.setItem("userProfile", JSON.stringify(userData));

      // ✅ Redirect to OTP page
      router.push(
        `/otp?mode=${isSignup ? "signup" : "login"}&doctorId=${doctorId}&email=${encodeURIComponent(
          email
        )}`
      );
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordIcon = showPass ? EyeOff : Eye;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      
      {/* LEFT HERO PANEL */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden"
      >
        <img
          src="/auth-bg-pattern.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-accent/60 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <motion.img
            src="/doctor-hero.png"
            alt="Doctor"
            className="w-72 h-auto drop-shadow-2xl mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          <h2 className="text-3xl font-bold font-serifPrimary text-primary-foreground mb-3">
            {isSignup ? `Join ${APP_NAME} Today` : `Welcome Back`}
          </h2>
          <p className="text-primary-foreground/80 text-base leading-relaxed mb-8 font-serifSecondary">
            {isSignup
              ? "Create your account and start managing your health instantly."
              : "Sign in to continue managing your health."}
          </p>
        </div>
      </motion.div>

      {/* RIGHT FORM PANEL */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 mx-auto flex items-center justify-center mb-3 shadow-lg shadow-teal-500/30">
              <span className="text-2xl">🏥</span>
            </div>
            <h1 className="text-2xl font-bold">{APP_NAME}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isSignup ? "Sign up to continue" : "Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-5">

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {isSignup && (
              <>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border text-sm"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mobile Number</label>
                  <div className="relative">
                    <Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Enter your mobile number"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-muted/50 border border-border text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg shadow-lg shadow-teal-500/30 transition-colors duration-200"
            >
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </motion.button>

            <div className="text-center text-sm text-muted-foreground">
              {isSignup ? (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-teal-600 font-semibold hover:underline"
                    onClick={() => setIsSignup(false)}
                  >
                    Login
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-teal-600 font-semibold hover:underline"
                    onClick={() => setIsSignup(true)}
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}