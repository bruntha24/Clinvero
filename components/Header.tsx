import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-semibold">Hello, Priya</h2>
        <p className="text-sm text-gray-500">
          Find your doctor
        </p>
      </div>

      <div className="relative">
        <Bell className="text-gray-600" />
        <span className="absolute -top-1 -right-1 bg-red-500 h-2 w-2 rounded-full"></span>
      </div>
    </div>
  );
}