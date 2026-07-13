"use client";

import type { Attendee } from "@/lib/attendees";

type Props = {
  attendee?: Attendee;
  onCheckIn: (id: string) => void;
};

export default function AttendeeCard({
  attendee,
  onCheckIn,
}: Props) {

  if (!attendee) {
    return null;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold">
            {attendee.full_name}
          </h2>

          <p className="text-gray-600">
            {attendee.email}
          </p>

          {attendee.company && (
            <p className="text-gray-600">
              {attendee.company}
            </p>
          )}

          {attendee.ticket_type && (
            <p className="mt-2 text-gray-600">
              {attendee.ticket_type}
            </p>
          )}

          {attendee.shirt_type && (
            <p className="mt-2 text-gray-600">
              Shirt: {attendee.shirt_type}
            </p>
          )}

          {attendee.checked_in && (
            <span className="mt-3 inline-block rounded-full bg-green-100 px-3 py-1 text-sm">
              Checked In
            </span>
          )}

        </div>


        {!attendee.checked_in && (
          <button
            onClick={() => onCheckIn(attendee.id)}
            className="rounded-lg bg-blue-700 px-6 py-3 font-bold text-white"
          >
            Check In
          </button>
        )}

      </div>


      {attendee.checked_in_at && (
        <p className="mt-4 text-sm text-gray-500">
          Checked in:
          {" "}
          {new Date(
            attendee.checked_in_at
          ).toLocaleString()}
        </p>
      )}

    </div>
  );
}