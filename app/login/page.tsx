"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false); // toggle between login/signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleAuth = () => {
    if (isSignup) {
      console.log("Signup:", { name, email, password });
      router.push("/otp"); // signup redirects to OTP
    } else {
      console.log("Login:", { email, password });
      router.push("/otp"); // login redirects somewhere else
    }
  };

  const PasswordIcon = showPass ? EyeOff : Eye;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ================= LEFT HERO PANEL ================= */}
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
          <motion.h2
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold font-serifPrimary text-primary-foreground mb-3"
          >
            {isSignup ? `Join ${APP_NAME} Today` : `Welcome Back`}
          </motion.h2>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-primary-foreground/80 text-base leading-relaxed mb-8 font-serifSecondary"
          >
            {isSignup
              ? "Create your account and start managing your health with top doctors instantly."
              : "Sign in to continue managing your health with top doctors instantly."}
          </motion.p>
        </div>
      </motion.div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:py-0 relative">
        <img
          src="/auth-bg-pattern.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 lg:hidden pointer-events-none"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl gradient-primary mx-auto flex items-center justify-center mb-3 shadow-lg shadow-primary/30"
            >
              <span className="text-2xl lg:text-3xl">🏥</span>
            </motion.div>
            <h1 className="text-2xl lg:text-3xl font-bold gradient-text">{APP_NAME}</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {isSignup ? "Sign up to continue" : "Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-3xl p-6 lg:p-8 space-y-5"
          >
            {/* Name (only for signup) */}
            {isSignup && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground outline-none text-sm"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PasswordIcon size={18} />
                </button>
              </div>
            </div>

            {/* Login / Signup Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
              onClick={handleAuth}
              className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg shadow-lg shadow-teal-500/30 transition-colors duration-200"
            >
              {isSignup ? "Sign Up" : "Login"}
            </motion.button>

            {/* Toggle login/signup link */}
            <div className="text-center text-sm text-muted-foreground">
              {isSignup ? (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary font-semibold hover:underline"
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
                    className="text-primary font-semibold hover:underline"
                    onClick={() => setIsSignup(true)}
                  >
                    Sign Up
                  </button>
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-card text-muted-foreground">or continue with</span>
              </div>
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-border text-foreground bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <img src="/google-logo.png" alt="Google Logo" className="w-5 h-5" />
              Continue with Google
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}