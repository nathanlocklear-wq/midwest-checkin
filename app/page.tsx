"use client";

import { useEffect, useState } from "react";
import { loadAttendees } from "@/lib/storage";

export default function Home() {
  const [search, setSearch] = useState("");
  const [attendees, setAttendees] = useState<any[]>([]);

  useEffect(() => {
    const stored = loadAttendees();

    if (stored && stored.length > 0) {
      const converted = stored.map((a: any) => ({
  id: a.id,
  name: a.fullName,
  company: a.company,
  shirtSize: a.shirtSize,

  shirtType: a.shirtType,

  reasons: a.shirtReasons || [],

  checkedIn: a.checkedIn,
}));

      setAttendees(converted);
    }
  }, []);

  const filteredAttendees = attendees.filter((attendee) => {
    const term = search.toLowerCase();

    return (
      attendee.name.toLowerCase().includes(term) ||
      attendee.company.toLowerCase().includes(term)
    );
  });

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-5xl mx-auto p-8">

        <h1 className="text-5xl font-bold text-center text-blue-900">
          MidwestTechTalk Check-In
        </h1>

        <p className="text-center text-slate-600 mt-3">
          Search attendees and check them in
        </p>

        <div className="grid grid-cols-3 gap-4 mt-8">

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <div className="text-3xl font-bold">
              {attendees.length}
            </div>
            <div className="text-slate-500">
              Registered
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <div className="text-3xl font-bold text-green-700">
              {attendees.filter(a => a.checkedIn).length}
            </div>
            <div className="text-slate-500">
              Checked In
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {attendees.length - attendees.filter(a => a.checkedIn).length}
            </div>
            <div className="text-slate-500">
              Remaining
            </div>
          </div>

        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-8 p-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="🔍 Search by name or organization..."
        />

        <p className="mt-3 text-slate-500">
          Showing {filteredAttendees.length} attendee(s)
        </p>

        <div className="space-y-5 mt-6">

          {filteredAttendees.map((attendee) => (

            <div
              key={attendee.id}
              className={`rounded-xl shadow-lg p-6 ${
  attendee.shirtType === "SPECIAL"
                  ? "bg-purple-50 border-2 border-purple-500"
                  : "bg-white border border-slate-200"
              }`}
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold text-slate-900">
                    {attendee.name}
                  </h2>

                  <p className="text-slate-600 mt-1">
                    {attendee.company}
                  </p>

                  <div className="mt-4 space-y-2">

                    <p>
                      <span className="font-semibold">
                        👕 Shirt Size:
                      </span>{" "}
                      {attendee.shirtSize}
                    </p>

                    {attendee.shirtType === "SPECIAL" ? (
                      <div>
                        <p className="font-bold text-purple-700">
                          ⭐ SPECIAL SHIRT
                        </p>

                        {attendee.reasons.map((reason: string) => (
                          <div
                            key={reason}
                            className="text-sm text-purple-700"
                          >
                            • {reason}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500">
                        Standard Shirt
                      </p>
                    )}

                  </div>

                </div>

                <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl">
                  Check In
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}