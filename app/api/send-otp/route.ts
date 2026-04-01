export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/*
⚠️ NOTE:
This in-memory store works only in development.
In production (Vercel), use Redis or a database.
*/

let otpStore: Record<string, { code: string; expires: number }> = {};
let verifiedEmails: Set<string> = new Set();

// 🛑 Prevent duplicate OTP requests (ANTI-SPAM LOCK)
let requestLock: Record<string, number> = {};

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000; // 60 sec cooldown

// ---------------- Create Transporter ----------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ---------------- POST → Send OTP ----------------
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email required" },
        { status: 400 }
      );
    }

    // ✅ Skip if already verified
    if (verifiedEmails.has(email)) {
      return NextResponse.json(
        { success: true, skipOtp: true },
        { status: 200 }
      );
    }

    // ✅ HARD RATE LIMIT FIX (prevents 2-3 OTPs issue)
    const now = Date.now();
    const lastRequest = requestLock[email];

    if (lastRequest && now - lastRequest < OTP_COOLDOWN_MS) {
      console.log("Duplicate request blocked");
      return NextResponse.json(
        { success: true, message: "OTP already sent. Please wait." },
        { status: 200 }
      );
    }

    requestLock[email] = now;

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    otpStore[email] = {
      code: otp,
      expires: now + OTP_EXPIRY_MS,
    };

    await transporter.sendMail({
      from: `"Daisy Hospital" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    console.log("OTP SENT:", otp);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Nodemailer Error:", err.message);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}

// ---------------- PUT → Verify OTP ----------------
export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const entry = otpStore[email];

    if (!entry) {
      return NextResponse.json(
        { success: false, error: "No OTP found" },
        { status: 400 }
      );
    }

    if (Date.now() > entry.expires) {
      delete otpStore[email];
      return NextResponse.json(
        { success: false, error: "OTP expired" },
        { status: 400 }
      );
    }

    if (entry.code === otp) {
      delete otpStore[email];
      verifiedEmails.add(email);

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: "Invalid OTP" },
      { status: 400 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}

// ---------------- Handle Other Methods ----------------
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}