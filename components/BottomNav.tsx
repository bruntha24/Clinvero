"use client";

import { Home, Calendar, FileText, User } from "lucide-react";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-white border-t flex justify-around py-3">
      <Home className="text-teal-600" />
      <Calendar className="text-gray-500" />
      <FileText className="text-gray-500" />
      <User className="text-gray-500" />
    </div>
  );
}