"use client";

import { Attendee } from "@/types/attendee";

interface Props {
  attendee: Attendee;
  onNext: () => void;
}

export default function SuccessView({
  attendee,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-2xl bg-green-700 p-10 text-center text-white shadow-xl">

        <div className="text-7xl">
          ✅
        </div>

        <h1 className="mt-6 text-5xl font-black">
          CHECKED IN
        </h1>

        <div className="mt-8 text-4xl font-bold">
          {attendee.fullName}
        </div>

        <div className="mt-3 text-2xl">
          {attendee.company}
        </div>

      </div>

      <button
        onClick={onNext}
        className="w-full rounded-xl bg-blue-700 py-6 text-2xl font-bold text-white hover:bg-blue-800"
      >
        📷 Scan Next Attendee
      </button>

    </div>
  );
}