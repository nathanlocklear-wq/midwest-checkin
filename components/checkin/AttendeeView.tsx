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
  const shirtStyle =
    attendee.shirt_type === "SPECIAL"
      ? "bg-red-50 border-red-200 text-[#e02427]"
      : attendee.shirt_type === "LATE"
      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
      : attendee.shirt_type === "NONE"
      ? "bg-slate-100 border-slate-200 text-slate-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-white p-8 shadow-2xl">

        <div className="text-center">

          <h1 className="text-5xl font-black text-[#02112f]">
            {attendee.full_name}
          </h1>

          <p className="mt-3 text-xl text-slate-600">
            {attendee.company || "No Company"}
          </p>

          <p className="mt-2 text-slate-500">
            {attendee.email}
          </p>

        </div>


        <div className="mt-8 space-y-5">
{attendee.badge_still_needed && (
  <div className="rounded-2xl border-2 border-red-600 bg-red-100 p-6 text-center">
    <div className="text-4xl font-black text-red-700">
      ⚠️ Badge Still Needed
    </div>

    <div className="mt-2 text-xl font-semibold text-red-700">
      This attendee registered after badge production.
      Please direct them to the badge printing table.
    </div>
  </div>
)}
          <div className="rounded-2xl bg-slate-100 p-6">

            <div className="text-sm font-black uppercase tracking-wide text-slate-500">
              Ticket Type
            </div>

            <div className="mt-2 text-2xl font-black text-[#02112f]">
              {attendee.ticket_type}
            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className={`rounded-2xl border p-6 ${shirtStyle}`}>

              <div className="text-sm font-black uppercase tracking-wide">
                Shirt
              </div>

              <div className="mt-2 text-3xl font-black">
                {attendee.shirt_type}
              </div>

            </div>


            <div className="rounded-2xl bg-slate-100 p-6">

              <div className="text-sm font-black uppercase tracking-wide text-slate-500">
                Size
              </div>

              <div className="mt-2 text-3xl font-black text-[#02112f]">
                {attendee.shirt_size || "-"}
              </div>

            </div>

          </div>


          {attendee.shirt_reasons?.length > 0 && (

            <div className="rounded-2xl bg-amber-100 p-6">

              <div className="text-sm font-black uppercase tracking-wide text-amber-800">
                Bonus Item
              </div>

              <div className="mt-3 flex flex-wrap gap-2">

                {attendee.shirt_reasons.map((reason) => (

                  <span
                    key={reason}
                    className="rounded-full bg-white px-4 py-2 font-bold text-amber-800"
                  >
                    {reason}
                  </span>

                ))}

              </div>

            </div>

          )}


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
        className="w-full rounded-2xl bg-[#e02427] py-6 text-3xl font-black text-white shadow-xl transition hover:bg-red-700"
      >
        ✅ CHECK IN
      </button>


      <button
        onClick={onScanAgain}
        className="w-full rounded-2xl bg-white py-5 text-xl font-black text-[#02112f] shadow-lg transition hover:bg-slate-100"
      >
        ← Back to Search
      </button>

    </div>
  );
}