"use client";

import Link from "next/link";

export default function ReportsNotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Report Not Found ❌</h1>
      <p className="mb-4">The patient you are looking for does not exist.</p>
      <Link href="/records" className="text-blue-600 underline">
        Back to Patient Records
      </Link>
    </div>
  );
}