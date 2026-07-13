"use client";

import CheckInWorkflow from "@/components/checkin/CheckInWorkflow";

export default function CheckInPage() {
  return (
    <main className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-xl p-6">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          MidwestTechTalk Check-In
        </h1>

        <CheckInWorkflow />
      </div>
    </main>
  );
}