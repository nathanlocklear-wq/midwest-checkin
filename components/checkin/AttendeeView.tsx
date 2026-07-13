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
      title: "🟣 SPECIAL SHIRT",
      subtitle: attendee.shirtReasons.join(", "),
    },
    STANDARD: {
      bg: "bg-green-700",
      title: "🟢 STANDARD SHIRT",
      subtitle: "Included with registration",
    },
    LATE: {
      bg: "bg-orange-600",
      title: "🟠 LATE REGISTRATION",
      subtitle: "No shirt today",
    },
    NONE: {
      bg: "bg-slate-700",
      title: "⚫ NO SHIRT",
      subtitle: attendee.shirtReasons.join(", "),
    },
  }[attendee.shirtType];

  return (
    <div className="space-y-6">

      <div className="rounded-2xl bg-white p-6 shadow">

        <h1 className="text-center text-4xl font-bold">
          {attendee.fullName}
        </h1>

        <p className="mt-2 text-center text-xl text-slate-600">
          {attendee.company}
        </p>

      </div>

      <div className={`${shirt.bg} rounded-2xl p-8 text-center text-white`}>

        <div className="text-4xl font-black">
          {shirt.title}
        </div>

        <div className="mt-4 text-2xl">
          {shirt.subtitle}
        </div>

        <div className="mt-8 text-8xl font-black">
          {attendee.shirtSize}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <button
          onClick={onScanAgain}
          className="rounded-xl bg-slate-300 py-5 text-xl font-bold"
        >
          🔄 Scan Again
        </button>

        <button
          onClick={onCheckIn}
          className="rounded-xl bg-blue-700 py-5 text-xl font-bold text-white"
        >
          ✅ Shirt Given
        </button>

      </div>

    </div>
  );
}