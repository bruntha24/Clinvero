"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { doctors } from "@/lib/mock-data";
import {
  Users,
  Clock,
  Star,
  Search,
  Filter,
  X,
  Phone,
  MessageCircle,
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useRouter } from "next/navigation";

export default function AllDoctorsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availability, setAvailability] = useState("all");
  const [experience, setExperience] = useState("all");
  const [rating, setRating] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  /* ---------------- FILTER OPTIONS ---------------- */
  const specialties = [
    "All",
    ...Array.from(new Set(doctors.map((d) => d.specialty))),
  ];

  const availabilityOptions = [
    { label: "All", value: "all" },
    { label: "Available Today", value: "available" },
    { label: "Not Available", value: "unavailable" },
  ];

  const experienceOptions = [
    { label: "All", value: "all" },
    { label: "5+ Years", value: "5" },
    { label: "10+ Years", value: "10" },
    { label: "15+ Years", value: "15" },
  ];

  const ratingOptions = [
    { label: "All", value: "all" },
    { label: "4.5+ Rating", value: "4.5" },
    { label: "4.7+ Rating", value: "4.7" },
    { label: "4.8+ Rating", value: "4.8" },
  ];

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.services.some((s: string) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSpecialty =
      specialty === "All" || doctor.specialty === specialty;

    const matchesAvailability =
      availability === "all" ||
      (availability === "available" && doctor.availableToday) ||
      (availability === "unavailable" && !doctor.availableToday);

    const matchesExperience =
      experience === "all" || doctor.experience >= Number(experience);

    const matchesRating =
      rating === "all" || doctor.rating >= Number(rating);

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesAvailability &&
      matchesExperience &&
      matchesRating
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pb-28">
      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-6 lg:gap-10">

        {/* DESKTOP FILTER + PREMIUM */}
        <div className="hidden lg:flex flex-col w-1/4 gap-6">
          {/* FILTER BOX */}
          <div className="bg-white rounded-3xl shadow-xl p-6 h-fit border border-gray-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">Filters</h3>

            <RoundRadioFilter
              title="Specialty"
              options={specialties}
              selected={specialty}
              setSelected={setSpecialty}
            />

            <RadioObjectFilter
              title="Availability"
              options={availabilityOptions}
              selected={availability}
              setSelected={setAvailability}
            />

            <RadioObjectFilter
              title="Experience"
              options={experienceOptions}
              selected={experience}
              setSelected={setExperience}
            />

            <RadioObjectFilter
              title="Rating"
              options={ratingOptions}
              selected={rating}
              setSelected={setRating}
            />
          </div>

                  {/* PREMIUM CARD FULL HEIGHT - TRUST & PREMIUM */}
                 {/* PREMIUM CARD FULL HEIGHT - TRUST, FAMILY, HEALTH TIPS & PREMIUM */}
<div className="flex-1 bg-gradient-to-b from-[#fffdf7] via-[#fff9eb] to-[#fff5dd] text-yellow-900 rounded-2xl p-6 shadow-lg flex flex-col justify-between text-center">

  <div className="space-y-5 flex-1 flex flex-col justify-start">

    {/* Header */}
    <h4 className="text-2xl font-bold mb-2">Trusted Care at Daisy Hospital</h4><br></br>
    
    {/* Family & Trust */}
    <p className="text-sm text-gray-800">
      Compassionate care for every family member. Safe, warm, and nurturing environment.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Experienced doctors. Advanced technology. Patient-first approach. 24/7 support.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Accredited facilities. Expert consultations. Modern equipment. Proven results.
    </p><br></br>

    {/* Health Tips & Promises */}
    <p className="text-sm text-gray-800">
      Preventive check-ups. Healthy lifestyle guidance. Timely vaccinations. Nutrition advice.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Personalized treatment plans. Gentle care. Transparency in every step. Your health, our priority.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Trusted by thousands of families. Holistic treatments. Ethical practices. Patient satisfaction guaranteed.
    </p><br></br>

    {/* Extra Words & Reassurance */}
    <p className="text-sm text-gray-800">
      Healing with heart. Comfort with care. Support every step. Confidence in every visit.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Excellence in service. Reliability in care. Compassion in action. Lifelong wellness for all ages.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Warm environment. Family-friendly. Safe, clean, and modern facilities. Your peace of mind matters.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Trusted generations. Daisy Hospital — your partner in health. Advanced diagnostics, modern surgery, and expert recovery plans.
    </p><br></br>
    <p className="text-sm text-gray-800">
      Comfort. Safety. Trust. Expertise. Dedication. Reliability. Excellence. Every step tailored for you.
    </p><br></br>

  </div>
  {/* SECOND TRUST SECTION */}
<div className="space-y-5 flex-1 flex flex-col justify-start mt-6">

  {/* Heading */}
  <h4 className="text-2xl font-bold mb-2">Our Promise to You</h4><br></br>

  {/* Trusted Promises */}
  <p className="text-sm text-gray-800">
    Safe, compassionate, and professional care at every step. Your well-being is our mission.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Experienced medical staff. Highly skilled specialists. Advanced treatment options.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Transparent communication. Timely updates. Clear guidance for you and your family.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Personalized health plans. Holistic care. Preventive measures. Wellness for life.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Modern facilities. Hygienic environment. State-of-the-art technology. Safety guaranteed.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Dedicated support team. 24/7 assistance. Emergency readiness. Peace of mind for every patient.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Trusted by generations. Recognized excellence. Ethical practices. Your health, our responsibility.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Comfort and care combined. Gentle procedures. Respect and dignity always. Confidence in every visit.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Healing with compassion. Guidance at every step. Monitoring and follow-up. Total trust and reliability.
  </p><br></br>
  <p className="text-sm text-gray-800">
    Excellence in service. Dedication to health. Continuous improvement. Your safety, our priority.
  </p><br></br>
<p className="text-lg font-bold text-yellow-900 mt-4">
  Why wait? Take charge of your health today!
</p>
<p className="text-lg font-bold text-yellow-900">
  Join Premium and experience trusted care like never before!
</p>
</div>

  {/* CTA */}
  <button className="mt-6 w-full bg-gradient-to-r from-[#fff5dd] to-[#ffe6b3] text-yellow-900 font-semibold px-4 py-3 rounded-full shadow hover:bg-[#ffeb9c] transition">
    Go for Premium
  </button>
</div>
        </div>

        {/* DIVIDER */}
        <div className="hidden lg:flex w-[2px] bg-gray-200" />

        {/* DOCTOR LIST */}
        <div className="w-full lg:w-3/4 flex flex-col gap-4">

          {/* SEARCH */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center bg-white rounded-2xl px-4 py-2 shadow w-full">
              <Search size={18} className="text-teal-600" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ml-3 bg-transparent focus:outline-none text-sm"
              />
            </div>

            {/* MOBILE FILTER BUTTON */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden bg-white p-3 rounded-2xl shadow"
            >
              <Filter size={18} />
            </button>
          </div>

          {/* DOCTOR CARDS */}
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg flex flex-col md:flex-row items-start gap-4"
              >
                {/* CARD DESIGN UNTOUCHED */}
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-2xl object-cover shadow-md"
                  />
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-xs font-semibold rounded-full shadow-md ${
                    doctor.availableToday
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>{doctor.availableToday ? "Available Today" : "Not Available"}</div>
                </div>

                <div className="flex-1 flex flex-col gap-1 relative">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-blue-900">{doctor.name}</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/doctor/${doctor.id}`); }}
                        className="flex items-center gap-1 bg-teal-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-teal-700 transition"
                      >
                        <Phone size={12} /> Call
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/doctor/${doctor.id}`); }}
                        className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-blue-700 transition"
                      >
                        <MessageCircle size={12} /> Message
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/doctor/${doctor.id}`); }}
                        className="hidden md:flex items-center gap-1 bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-purple-700 transition"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>

                  <div onClick={() => router.push(`/doctor/${doctor.id}`)} className="cursor-pointer mt-1">
                    <p className="text-teal-600 font-medium text-sm">{doctor.specialty}</p>
                    <p className="text-xs text-gray-500">{doctor.qualification}</p>

                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-700">
                      <span className="flex items-center gap-1"><Users size={12} /> {doctor.patients}+ Patients</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {doctor.experience} Yrs</span>
                      <span className="flex items-center gap-1"><Star size={12} /> {doctor.rating}</span>
                    </div>

                    <p className="mt-1 text-xs text-gray-600 leading-relaxed line-clamp-3">{doctor.about}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {doctor.services.map((s) => (
                        <span key={s} className="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border border-yellow-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/doctor/${doctor.id}`)}
                    className="md:hidden mt-3 w-full bg-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-2xl shadow hover:bg-teal-700 transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end lg:hidden">
          <div className="w-3/4 bg-white h-full p-6 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X /></button>
            </div>

            <RoundRadioFilter
              title="Specialty"
              options={specialties}
              selected={specialty}
              setSelected={setSpecialty}
            />

            <RadioObjectFilter
              title="Availability"
              options={availabilityOptions}
              selected={availability}
              setSelected={setAvailability}
            />

            <RadioObjectFilter
              title="Experience"
              options={experienceOptions}
              selected={experience}
              setSelected={setExperience}
            />

            <RadioObjectFilter
              title="Rating"
              options={ratingOptions}
              selected={rating}
              setSelected={setRating}
            />
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

/* ---------------- FILTER COMPONENTS ---------------- */
function RoundRadioFilter({ title, options, selected, setSelected }: any) {
  return (
    <div className="mb-4">
      <h4 className="font-semibold text-blue-800 mb-2">{title}</h4>
      <div className="flex flex-col gap-2">
        {options.map((option: string) => (
          <label key={option} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name={title}
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
              className="w-4 h-4 accent-yellow-400"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function RadioObjectFilter({ title, options, selected, setSelected }: any) {
  return (
    <div className="mb-4">
      <h4 className="font-semibold text-blue-800 mb-2">{title}</h4>
      <div className="flex flex-col gap-2">
        {options.map((opt: any) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              className="w-4 h-4 accent-yellow-400"
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}