"use client";

import { Attendee } from "@/types/attendee";

interface Props {
  attendee: Attendee;
  onCheckIn: (id: string) => void;
}

export default function AttendeeCard({
  attendee,
  onCheckIn,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-lg">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div className="flex-1">

          <h2 className="text-2xl font-bold">
            {attendee.fullName}
          </h2>

          <p className="text-slate-600">
            {attendee.company}
          </p>

          <p className="text-sm text-slate-400">
            {attendee.email}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {attendee.ticketType}
            </span>

            <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
              {attendee.shirtType}
            </span>

            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm">
              {attendee.shirtSize}
            </span>

            {(attendee.shirtReasons ?? []).map((reason) => (
  <span
    key={reason}
    className="rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700"
  >
    {reason}
  </span>
))}

          </div>
        </div>

        <div>

          {attendee.checkedIn ? (
            <div className="rounded-lg bg-green-100 px-6 py-4 text-center font-semibold text-green-700">
              ✅ Checked In
            </div>
          ) : (
            <button
              onClick={() => onCheckIn(attendee.id)}
              className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
            >
              Check In
            </button>
          )}

        </div>

      </div>
    </div>
  );
}