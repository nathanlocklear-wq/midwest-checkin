"use client";

import { useEffect, useState } from "react";
import type { Attendee } from "@/lib/attendees";

type Props = {
  attendee: Attendee;
  onNext: () => void;
};

export default function SuccessView({
  attendee,
  onNext,
}: Props) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          clearInterval(timer);
          onNext();
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNext]);

  const shirtColor =
    attendee.shirt_type === "SPECIAL"
      ? "bg-red-50 border-red-200 text-[#e02427]"
      : attendee.shirt_type === "LATE"
      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
      : attendee.shirt_type === "NONE"
      ? "bg-slate-100 border-slate-200 text-slate-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">

        <div className="text-8xl">
          ✅
        </div>

        <h1 className="mt-6 text-5xl font-black text-green-700">
          Checked In!
        </h1>

        <h2 className="mt-8 text-4xl font-black text-[#02112f]">
          {attendee.full_name}
        </h2>

        <p className="mt-3 text-xl text-slate-600">
          {attendee.company || "No Company"}
        </p>


        <div className="mt-10 grid grid-cols-2 gap-5">

          <div className={`rounded-2xl border p-6 ${shirtColor}`}>

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

          <div className="mt-8 rounded-2xl bg-red-50 p-6 text-left">

            <div className="text-sm font-black uppercase tracking-wide text-[#e02427]">
              Special Shirt Reason
            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {attendee.shirt_reasons.map((reason) => (

                <span
                  key={reason}
                  className="rounded-full bg-white px-4 py-2 font-bold text-[#e02427]"
                >
                  {reason}
                </span>

              ))}

            </div>

          </div>

        )}


        {attendee.presenting && (

          <div className="mt-8 rounded-2xl bg-purple-100 p-5 text-2xl font-black text-purple-800">
            🎤 Presenter
          </div>

        )}


        <div className="mt-8 rounded-2xl bg-[#02112f] p-5 text-white">

          <p className="text-lg font-bold">
            Returning to check-in in {countdown}...
          </p>

        </div>

      </div>


      <button
        onClick={onNext}
        className="w-full rounded-2xl bg-[#e02427] py-6 text-2xl font-black text-white shadow-xl transition hover:bg-red-700"
      >
        Next Attendee →
      </button>

    </div>
  );
}