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

      <div className="rounded-2xl bg-white p-10 text-center shadow">

        <h1 className="text-5xl font-black text-blue-900">
          {attendee.full_name}
        </h1>

        <p className="mt-4 text-2xl text-gray-700">
          {attendee.email}
        </p>

        {attendee.company && (
          <p className="mt-2 text-xl text-gray-600">
            {attendee.company}
          </p>
        )}

        {attendee.ticket_type && (
          <p className="mt-6 text-xl font-bold">
            Ticket: {attendee.ticket_type}
          </p>
        )}

        {attendee.shirt_type && (
          <p className="mt-2 text-xl font-bold">
            Shirt: {attendee.shirt_type}
          </p>
        )}

      </div>


      <button
        onClick={onCheckIn}
        className="w-full rounded-xl bg-green-600 py-6 text-3xl font-bold text-white"
      >
        ✅ Check In
      </button>


      <button
        onClick={onScanAgain}
        className="w-full rounded-xl bg-blue-700 py-5 text-2xl font-bold text-white"
      >
        📷 Scan Another Badge
      </button>

    </div>
  );
}