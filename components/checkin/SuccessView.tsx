"use client";

import type { Attendee } from "@/lib/attendees";

type Props = {
  attendee: Attendee;
  onNext: () => void;
};

export default function SuccessView({
  attendee,
  onNext,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-green-600 p-10 text-center text-white shadow-2xl">

        <div className="text-8xl">
          ✅
        </div>

        <h1 className="mt-6 text-5xl font-black">
          Checked In!
        </h1>

        <h2 className="mt-8 text-4xl font-bold">
          {attendee.full_name}
        </h2>

        <p className="mt-3 text-2xl opacity-90">
          {attendee.company || "No Company"}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-5">

          <div className="rounded-2xl bg-white p-6">
            <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Shirt
            </div>

            <div className="mt-2 text-3xl font-black text-blue-700">
              {attendee.shirt_type}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6">
            <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Size
            </div>

            <div className="mt-2 text-3xl font-black text-slate-900">
              {attendee.shirt_size}
            </div>
          </div>

        </div>

        {attendee.presenting && (
          <div className="mt-8 rounded-2xl bg-yellow-300 p-5 text-2xl font-black text-black">
            🎤 Presenter
          </div>
        )}

      </div>

      <button
        onClick={onNext}
        className="w-full rounded-2xl bg-blue-700 py-6 text-2xl font-black text-white transition hover:bg-blue-800"
      >
        Next Attendee →
      </button>

    </div>
  );
}