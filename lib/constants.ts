// lib/constants.ts

// App-wide constants
export const APP_NAME = "Doctor App";

// Color palette (if using Tailwind custom colors, you can map them here)
export const COLORS = {
  primary: "#0d9488",      // Teal 600
  primaryForeground: "#ffffff",
  accent: "#f97316",       // Orange 500
  muted: "#f3f4f6",        // Gray 100
  border: "#d1d5db",       // Gray 300
};

// Other constants
export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  OTP: "/otp",
};

// Features for hero section
export const FEATURES = [
  { icon: "Heart", label: "Trusted Care", desc: "500+ verified doctors" },
  { icon: "Shield", label: "Secure & Private", desc: "HIPAA compliant" },
  { icon: "Clock", label: "24/7 Available", desc: "Book anytime" },
];

// 🌞 Added for Appointment Page
export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];