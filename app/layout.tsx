// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

// ✅ Server-side metadata
export const metadata: Metadata = {
  title: "Clinvero - Always with you, for your healthcare",
  description: "Healthcare Appointment",
  icons: {
    icon: "/icon.jpg",
  },
};

// ✅ RootLayout remains a pure server component
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          html {
            font-family: 'Libre Caslon Text', 'Playfair Display', serif;
          }
        `}</style>
      </head>

      <body className="bg-gray-100 flex justify-center">
        <div className="w-full max-w-[1440px] min-h-screen bg-white shadow-sm relative">
          {children}
        </div>
      </body>
    </html>
  );
}