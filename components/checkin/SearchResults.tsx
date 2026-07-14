"use client";

import type { Attendee } from "@/lib/attendees";

type Props = {
  attendees: Attendee[];
  onSelect: (attendee: Attendee) => void;
};

export default function SearchResults({
  attendees,
  onSelect,
}: Props) {
  if (attendees.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
        <p className="text-lg font-semibold text-gray-700">
          No attendees found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {attendees.map((attendee) => (
        <button
          key={attendee.id}
          onClick={() => onSelect(attendee)}
          className="w-full rounded-2xl border border-slate-200 bg-white p-6 text-left shadow transition hover:border-blue-500 hover:shadow-xl"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {attendee.full_name}
              </h2>

              <p className="mt-1 text-lg text-slate-600">
                {attendee.company || "No Company"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {attendee.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                  {attendee.shirt_type}
                </span>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                  {attendee.shirt_size}
                </span>

                {attendee.presenting && (
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                    Presenter
                  </span>
                )}

              </div>
            </div>

            {attendee.checked_in ? (
              <div className="rounded-xl bg-green-100 px-4 py-2 font-bold text-green-700">
                ✓ Checked In
              </div>
            ) : (
              <div className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white">
                Check In →
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}