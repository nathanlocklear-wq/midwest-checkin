"use client";

import { Attendee } from "@/types/attendee";

interface Props {
  attendee: Attendee;
  onCheckIn: () => void;
  onScanAgain: () => void;
}

export default function AttendeeView({
  attendee,
  onCheckIn,
  onScanAgain,
}: Props) {
  const shirt = {
    SPECIAL: {
      bg: "bg-purple-700",
      title: "🟣 PURPLE SHIRT",
      subtitle: attendee.shirtReasons.join(", "),
    },
    STANDARD: {
      bg: "bg-green-700",
      title: "🟢 GREEN SHIRT",
      subtitle: "Conference Attendee",
    },
    LATE: {
      bg: "bg-orange-600",
      title: "🟠 NO SHIRT TODAY",
      subtitle: "Late Registration",
    },
    NONE: {
      bg: "bg-slate-700",
      title: "⚫ NO SHIRT",
      subtitle: attendee.shirtReasons.join(", "),
    },
  }[attendee.shirtType];

  return (
    <div className="space-y-5">

      <div className="rounded-2xl bg-white p-6 shadow-xl">

        <h1 className="text-center text-5xl font-black text-slate-900">
          {attendee.fullName}
        </h1>

        <p className="mt-3 text-center text-2xl text-slate-600">
          {attendee.company || "No Company"}
        </p>

        <p className="mt-2 text-center text-lg text-slate-500">
          {attendee.email}
        </p>

      </div>

      <div
        className={`${shirt.bg} rounded-3xl p-8 text-center text-white shadow-2xl`}
      >
        <div className="text-4xl font-black tracking-wide">
          {shirt.title}
        </div>

        <div className="mt-4 text-xl opacity-90">
          {shirt.subtitle}
        </div>

        <div className="mt-10 text-lg uppercase tracking-widest opacity-80">
          Shirt Size
        </div>

        <div className="mt-2 text-9xl font-black leading-none">
          {attendee.shirtSize || "-"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <button
          onClick={onScanAgain}
          className="rounded-2xl border-2 border-slate-300 bg-white py-6 text-xl font-bold text-slate-800 transition hover:bg-slate-100"
        >
          🔄 Scan Again
        </button>

        <button
          onClick={onCheckIn}
          className="rounded-2xl bg-blue-700 py-6 text-xl font-bold text-white transition hover:bg-blue-800"
        >
          ✅ Shirt Given
        </button>

      </div>

    </div>
  );
}