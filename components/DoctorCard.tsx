import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Props {
  name: string;
  specialization: string;
  time: string;
}

export default function DoctorCard({
  name,
  specialization,
  time,
}: Props) {
  return (
    <Card className="p-4 rounded-xl shadow-sm flex gap-4">
      <div className="relative h-20 w-20 rounded-xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1537368910025-700350fe46c7"
          alt="doctor"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 space-y-1">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">
          {specialization}
        </p>
        <Badge className="bg-green-100 text-green-700">
          Available today
        </Badge>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </Card>
  );
}