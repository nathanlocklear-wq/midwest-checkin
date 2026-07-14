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
      <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">

        <div className="text-5xl">
          🔍
        </div>

        <h2 className="mt-4 text-3xl font-black text-[#02112f]">
          No Attendees Found
        </h2>

        <p className="mt-2 text-slate-500">
          Try another name, email, or organization.
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-5">

      {attendees.map((attendee) => {

        const shirtStyle =
          attendee.shirt_type === "SPECIAL"
            ? "bg-red-50 text-[#e02427]"
            : attendee.shirt_type === "LATE"
            ? "bg-yellow-50 text-yellow-700"
            : attendee.shirt_type === "NONE"
            ? "bg-slate-100 text-slate-700"
            : "bg-green-50 text-green-700";

        return (
          <button
            key={attendee.id}
            onClick={() => onSelect(attendee)}
            className="w-full rounded-3xl bg-white p-7 text-left shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
          >

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex-1">

                <h2 className="text-3xl font-black text-[#02112f]">
                  {attendee.full_name}
                </h2>

                <p className="mt-2 text-lg text-slate-600">
                  {attendee.company || "No Company"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {attendee.email}
                </p>


                <div className="mt-5 flex flex-wrap gap-2">

                  <span
                    className={`rounded-full px-4 py-2 font-black ${shirtStyle}`}
                  >
                    👕 {attendee.shirt_type}
                  </span>


                  <span className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700">
                    Size {attendee.shirt_size || "-"}
                  </span>


                  {attendee.presenting && (
                    <span className="rounded-full bg-purple-100 px-4 py-2 font-bold text-purple-700">
                      🎤 Presenter
                    </span>
                  )}


                  {attendee.shirt_reasons?.map((reason) => (
                    <span
                      key={reason}
                      className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700"
                    >
                      ⭐ {reason}
                    </span>
                  ))}

                </div>

              </div>


              <div>

                {attendee.checked_in ? (
                  <div className="rounded-2xl bg-green-100 px-6 py-4 text-center font-black text-green-700">
                    ✅ Checked In
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#e02427] px-6 py-4 text-center font-black text-white">
                    Check In →
                  </div>
                )}

              </div>

            </div>

          </button>
        );
      })}

    </div>
  );
}