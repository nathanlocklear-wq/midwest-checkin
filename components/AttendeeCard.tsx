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
  function shirtInfo() {
    switch (attendee.shirtType) {
      case "SPECIAL":
        return {
          color: "bg-purple-50 border-purple-500",
          badge: "🟣 SPECIAL SHIRT",
          text: "text-purple-700",
        };

      case "STANDARD":
        return {
          color: "bg-green-50 border-green-500",
          badge: "🟢 STANDARD SHIRT",
          text: "text-green-700",
        };

      case "LATE":
        return {
          color: "bg-orange-50 border-orange-500",
          badge: "🟠 LATE - NO SHIRT TODAY",
          text: "text-orange-700",
        };

      default:
        return {
          color: "bg-gray-100 border-gray-400",
          badge: "⚫ NO SHIRT",
          text: "text-gray-700",
        };
    }
  }

  const shirt = shirtInfo();

  return (
    <div
      className={`rounded-xl border-2 shadow-lg p-6 ${shirt.color}`}
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-6">

        <div className="flex-1">

          <h2 className="text-2xl font-bold text-slate-900">
            {attendee.fullName}
          </h2>

          <p className="text-slate-600">
            {attendee.company}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4">

            <div>
              <div className="text-sm text-gray-500">
                Ticket
              </div>

              <div className="font-semibold">
                {attendee.ticketType}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">
                Shirt Size
              </div>

              <div className="font-semibold">
                {attendee.shirtSize || "-"}
              </div>
            </div>

          </div>

          <div className="mt-6">

            <div className={`font-bold ${shirt.text}`}>
              {shirt.badge}
            </div>

            {(attendee.shirtReasons ?? []).length > 0 && (
              <div className="mt-3">

                <div className="font-semibold">
                  Reasons
                </div>

                <ul className="list-disc list-inside text-sm">

                  {(attendee.shirtReasons ?? []).map((reason) => (
                    <li key={reason}>
                      {reason}
                    </li>
                  ))}

                </ul>

              </div>
            )}

          </div>

        </div>

        <div className="flex items-center">

          {attendee.checkedIn ? (
            <div className="text-center">

              <div className="bg-gray-700 text-white rounded-xl px-8 py-4 font-bold">
                ✔ CHECKED IN
              </div>

              {attendee.checkedInAt && (
                <div className="text-sm mt-2 text-gray-600">
                  {attendee.checkedInAt}
                </div>
              )}

            </div>
          ) : (
            <button
              onClick={() => onCheckIn(attendee.id)}
              className="bg-blue-700 hover:bg-blue-800 text-white rounded-xl px-8 py-4 font-bold text-lg"
            >
              Check In
            </button>
          )}

        </div>

      </div>
    </div>
  );
}