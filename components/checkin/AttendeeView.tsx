"use client";

import type { Attendee } from "@/lib/attendees";

type Props = {
  attendee: Attendee;
  onCheckIn: () => void;
  onScanAgain: () => void;
};

export default function AttendeeView({
  attendee,
  onCheckIn,
  onScanAgain,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6 text-center">
          <h1 className="text-4xl font-black text-slate-900">
            {attendee.full_name}
          </h1>

          <p className="mt-2 text-xl text-slate-600">
            {attendee.company || "No Company"}
          </p>

          <p className="mt-1 text-base text-slate-500">
            {attendee.email}
          </p>
        </div>

        <div className="grid gap-4">

          <div className="rounded-2xl bg-slate-100 p-5">
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Ticket Type
            </div>

            <div className="mt-1 text-2xl font-bold text-slate-900">
              {attendee.ticket_type}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Shirt
              </div>

              <div className="mt-1 text-3xl font-black text-blue-900">
                {attendee.shirt_type}
              </div>
            </div>

            <div className="rounded-2xl bg-gray-100 p-5">
              <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                Size
              </div>

              <div className="mt-1 text-3xl font-black text-slate-900">
                {attendee.shirt_size}
              </div>
            </div>

          </div>

          {attendee.presenting && (
            <div className="rounded-2xl bg-purple-100 p-5 text-center">
              <div className="text-2xl font-black text-purple-800">
                🎤 Presenter
              </div>
            </div>
          )}

        </div>

      </div>

      <button
        onClick={onCheckIn}
        className="w-full rounded-2xl bg-green-600 py-6 text-3xl font-black text-white transition hover:bg-green-700"
      >
        ✅ CHECK IN
      </button>

      <button
        onClick={onScanAgain}
        className="w-full rounded-2xl bg-slate-700 py-5 text-xl font-bold text-white transition hover:bg-slate-800"
      >
        ← Back to Search
      </button>

    </div>
  );
}