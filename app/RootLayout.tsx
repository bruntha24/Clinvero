import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor App",
  description: "Healthcare Appointment UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        {/* Center mobile content with max width */}
        <div className="w-full min-h-screen flex justify-center items-start lg:items-stretch">
          <div className="w-full lg:w-full max-w-[420px] lg:max-w-full flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}