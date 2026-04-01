export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route?: string;
  instructions?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // ---------------- Extract all fields with defaults ----------------
    const patientEmail = data.patientEmail || data.email;
    const patientName = data.patientName?.trim() || "Patient";
    const doctorName = data.doctorName?.trim() || "Dr. John Doe";
    const doctorLicense = data.doctorLicense?.trim() || "LT341";
    const specialty = data.specialty?.trim() || "Cardiology";
    const clinicName = data.clinicName?.trim() || "Clinvero Hospital";
    const diagnosis = data.diagnosis?.trim() || "Heart problem";
    const medications: Medication[] =
      Array.isArray(data.medications) && data.medications.length > 0
        ? data.medications
        : [
            {
              name: "Aspirin",
              dosage: "75mg",
              frequency: "Once daily",
              duration: "30 days",
            },
            {
              name: "Atorvastatin",
              dosage: "20mg",
              frequency: "Once daily",
              duration: "30 days",
            },
          ];
    const additionalNotes =
      data.additionalNotes?.trim() ||
      "Take medicines after food, follow up in 2 weeks";

    if (!patientEmail) {
      return NextResponse.json(
        { success: false, error: "Patient email is required" },
        { status: 400 }
      );
    }

    // ---------------- Build plain email text ----------------
    let emailText = `Dear ${patientName},\n\nHere are your prescription details:\n\n`;
    emailText += `Doctor: ${doctorName} (${specialty}), License: ${doctorLicense}, Clinic: ${clinicName}\n`;
    emailText += `Diagnosis: ${diagnosis}\n`;
    emailText += `Medications:\n`;
    medications.forEach((m, idx) => {
      const parts: string[] = [];
      if (m.name) parts.push(m.name);
      if (m.dosage) parts.push(m.dosage);
      if (m.frequency) parts.push(m.frequency);
      if (m.duration) parts.push(m.duration);
      let medLine = `${idx + 1}. ${parts.join(", ")}`;
      if (m.instructions) medLine += ` (Instructions: ${m.instructions})`;
      emailText += medLine + "\n";
    });
    emailText += `\nAdditional Notes: ${additionalNotes}\n\nStay healthy!\n- Clinvero Hospital`;

 // ---------------- Generate Premium PDF ----------------
const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([600, 800]);
const { width, height } = page.getSize();

const fontSize = 12;
const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

const teal = rgb(0, 0.5, 0.5);
const lightTeal = rgb(0.85, 0.95, 0.95);

const marginX = 50;
const contentWidth = width - marginX * 2;
const lineHeight = 18;

// ===== HEADER =====
page.drawRectangle({
  x: 0,
  y: height - 120,
  width: width,
  height: 120,
  color: teal,
});

page.drawText("CLINVERO HOSPITAL", {
  x: width / 2 - 150,
  y: height - 60,
  size: 26,
  font: fontBold,
  color: rgb(1, 1, 1),
});

page.drawText(
  "Trusted Care. Advanced Treatment. Compassionate Healing.",
  {
    x: width / 2 - 180,
    y: height - 85,
    size: 12,
    font: fontRegular,
    color: rgb(1, 1, 1),
  }
);

page.drawText(
  "24/7 Emergency | Cardiology | Neurology | General Medicine",
  {
    x: width / 2 - 170,
    y: height - 100,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
  }
);

// Logo
const logoBytes = fs.readFileSync("public/hos.png");
const logoImage = await pdfDoc.embedPng(logoBytes);
const logoDims = logoImage.scale(0.22);
page.drawImage(logoImage, {
  x: 40,
  y: height - 95,
  width: logoDims.width,
  height: logoDims.height,
});

// ===== BODY START =====
let yPos = height - 150;

// ---------- Doctor Section ----------
page.drawText("Doctor Information", {
  x: marginX,
  y: yPos,
  size: 14,
  font: fontBold,
  color: teal,
});
yPos -= lineHeight;

page.drawText(`Name: Dr. ${doctorName}`, {
  x: marginX,
  y: yPos,
  size: fontSize,
  font: fontRegular,
});
yPos -= lineHeight;

page.drawText(`Specialty: ${specialty}`, {
  x: marginX,
  y: yPos,
  size: fontSize,
  font: fontRegular,
});
yPos -= lineHeight;

page.drawText(`License No: ${doctorLicense}`, {
  x: marginX,
  y: yPos,
  size: fontSize,
  font: fontRegular,
});
yPos -= 30;

// ---------- Patient Section ----------
page.drawText("Patient Details", {
  x: marginX,
  y: yPos,
  size: 14,
  font: fontBold,
  color: teal,
});
yPos -= lineHeight;

page.drawText(`Patient Name: ${patientName}`, {
  x: marginX,
  y: yPos,
  size: fontSize,
  font: fontRegular,
});
yPos -= lineHeight;

page.drawText(`Diagnosis: ${diagnosis}`, {
  x: marginX,
  y: yPos,
  size: fontSize,
  font: fontRegular,
});
yPos -= 35;

// ---------- Medicines Section ----------
page.drawText("Prescribed Medications", {
  x: marginX,
  y: yPos,
  size: 14,
  font: fontBold,
  color: teal,
});
yPos -= 22;

// Table Header Background
page.drawRectangle({
  x: marginX,
  y: yPos - 4,
  width: contentWidth,
  height: 22,
  color: lightTeal,
});

page.drawText("No", { x: marginX + 5, y: yPos, size: 11, font: fontBold });
page.drawText("Medicine", { x: marginX + 40, y: yPos, size: 11, font: fontBold });
page.drawText("Dosage", { x: marginX + 200, y: yPos, size: 11, font: fontBold });
page.drawText("Frequency", { x: marginX + 280, y: yPos, size: 11, font: fontBold });
page.drawText("Duration", { x: marginX + 380, y: yPos, size: 11, font: fontBold });

yPos -= 20;

// Table Rows
medications.forEach((m, index) => {
  page.drawText(`${index + 1}`, {
    x: marginX + 5,
    y: yPos,
    size: 11,
    font: fontRegular,
  });

  page.drawText(m.name || "-", {
    x: marginX + 40,
    y: yPos,
    size: 11,
    font: fontRegular,
  });

  page.drawText(m.dosage || "-", {
    x: marginX + 200,
    y: yPos,
    size: 11,
    font: fontRegular,
  });

  page.drawText(m.frequency || "-", {
    x: marginX + 280,
    y: yPos,
    size: 11,
    font: fontRegular,
  });

  page.drawText(m.duration || "-", {
    x: marginX + 380,
    y: yPos,
    size: 11,
    font: fontRegular,
  });

  yPos -= 18;

  if (m.instructions) {
    page.drawText(`Instructions: ${m.instructions}`, {
      x: marginX + 40,
      y: yPos,
      size: 10,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPos -= 18;
  }
});

yPos -= 20;

// ---------- Additional Notes ----------
page.drawText("Additional Notes:", {
  x: marginX,
  y: yPos,
  size: 13,
  font: fontBold,
  color: teal,
});
yPos -= lineHeight;

page.drawText(additionalNotes || "N/A", {
  x: marginX,
  y: yPos,
  size: fontSize,
  font: fontRegular,
});
yPos -= 40;

// ---------- Medical Advisory Card ----------
page.drawRectangle({
  x: marginX - 10,
  y: yPos - 85,
  width: contentWidth + 20,
  height: 85,
  borderColor: teal,
  borderWidth: 1.5,
  color: rgb(0.94, 0.98, 0.98),
});

page.drawText("Medical Advisory & Instructions", {
  x: marginX,
  y: yPos - 18,
  size: 13,
  font: fontBold,
  color: teal,
});

page.drawText(
  "• The dosage should be taken strictly as recommended by the doctor.",
  { x: marginX, y: yPos - 36, size: 11, font: fontRegular }
);

page.drawText(
  "• Do not skip or discontinue medication without consultation.",
  { x: marginX, y: yPos - 52, size: 11, font: fontRegular }
);

page.drawText(
  "• Seek immediate care if severe symptoms occur.",
  { x: marginX, y: yPos - 68, size: 11, font: fontRegular }
);

yPos -= 110;

// ---------- Visit Reminder Card ----------
page.drawRectangle({
  x: marginX - 10,
  y: yPos - 75,
  width: contentWidth + 20,
  height: 75,
  borderColor: teal,
  borderWidth: 1.5,
  color: rgb(0.90, 0.97, 0.97),
});

page.drawText("Hospital Visit Reminder", {
  x: marginX,
  y: yPos - 18,
  size: 13,
  font: fontBold,
  color: teal,
});

page.drawText(
  "• Bring ECG reports, medical certificates & investigation records.",
  { x: marginX, y: yPos - 36, size: 11, font: fontRegular }
);

page.drawText(
  "• Present your hospital token during your next visit.",
  { x: marginX, y: yPos - 52, size: 11, font: fontRegular }
);

yPos -= 95;

// ---------- Signature ----------
// Draw signature line slightly lower
page.drawLine({
  start: { x: width - 200, y: yPos - 2 },  // line moved 2 points down
  end: { x: width - 60, y: yPos - 2 },
  thickness: 1,
  color: rgb(0, 0, 0),
});

// Name with small gap above line
page.drawText("Dr. Aravind Kumar", {
  x: width - 180,
  y: yPos + 2,   // small gap above line
  size: 12,      // slightly smaller font
  font: fontRegular,
  color: teal,
});

// Designation just below name
page.drawText("Dean - CLINVERO", {
  x: width - 165,
  y: yPos - 8,   // small gap below name
  size: 9,       // slightly smaller font
  font: fontRegular,
});
// ---------- Footer ----------
page.drawRectangle({
  x: 0,
  y: 0,
  width: width,
  height: 60,
  color: teal,
});

page.drawText(
  "Clinvero Hospital | 123 Health Street | +91 98765 43210 | info@clinvero.com",
  {
    x: width / 2 - 200,
    y: 35,
    size: 10,
    font: fontRegular,
    color: rgb(1, 1, 1),
  }
);

page.drawText(
  "This prescription is digitally generated and valid without physical signature.",
  {
    x: width / 2 - 210,
    y: 20,
    size: 9,
    font: fontRegular,
    color: rgb(1, 1, 1),
  }
);

page.drawText("Wishing You a Speedy Recovery & Good Health.", {
  x: width / 2 - 150,
  y: 8,
  size: 9,
  font: fontRegular,
  color: rgb(1, 1, 1),
});

const pdfBytes = await pdfDoc.save();

    // ---------------- Send email ----------------
    await transporter.sendMail({
      from: `"Clinvero Hospital" <${process.env.SMTP_USER}>`,
      to: patientEmail,
      subject: `Prescription from ${doctorName}`,
      text: emailText,
      attachments: [
        {
          filename: `Prescription_${patientName}.pdf`,
          content: Buffer.from(pdfBytes),
        },
      ],
    });

    console.log(`✅ Prescription sent to ${patientEmail}`);
    return NextResponse.json(
      { success: true, message: "Prescription sent successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Send Prescription Email Error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to send prescription" },
      { status: 500 }
    );
  }
}

// ---------------- GET method ----------------
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}