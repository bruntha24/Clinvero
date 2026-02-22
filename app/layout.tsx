import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor App",
  description: "Healthcare Appointment UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
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
        <div className="w-full max-w-[1420px] min-h-screen bg-white shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}