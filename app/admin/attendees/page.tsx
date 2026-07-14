"use client";

import { useEffect, useMemo, useState } from "react";
import AppLayout from "@/components/AppLayout";

import {
  getAttendees,
  checkInAttendee,
  undoCheckInAttendee,
  type Attendee,
} from "@/lib/attendees";

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    try {
      const data = await getAttendees();
      setAttendees(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return attendees.filter(
      (a) =>
        a.full_name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q)
    );
  }, [attendees, search]);

  async function toggle(attendee: Attendee) {
    const updated = attendee.checked_in
      ? await undoCheckInAttendee(attendee.id)
      : await checkInAttendee(attendee.id);

    setAttendees((current) =>
      current.map((a) => (a.id === updated.id ? updated : a))
    );
  }

  return (
    <AppLayout
      title="Attendee Manager"
      subtitle="Search, Check In, and Undo Check-In"
    >
      <div className="space-y-6">

        <div className="rounded-3xl bg-white p-8 shadow-2xl">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, company or email..."
            className="w-full rounded-2xl border-2 border-slate-300 p-5 text-xl text-slate-900 focus:border-[#e02427] focus:outline-none"
          />

        </div>

        <div className="font-bold text-white">
          {filtered.length} Attendees
        </div>

        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">
            Loading attendees...
          </div>
        )}

        {!loading &&
          filtered.map((attendee) => (
            <div
              key={attendee.id}
              className="rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex-1">

                  <h2 className="text-3xl font-black text-[#02112f]">
                    {attendee.full_name}
                  </h2>

                  <p className="mt-1 text-lg text-slate-600">
                    {attendee.company}
                  </p>

                  <p className="text-sm text-slate-500">
                    {attendee.email}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">

                    <span className="rounded-full bg-red-100 px-4 py-2 font-bold text-[#e02427]">
                      {attendee.shirt_type}
                    </span>

                    <span className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-700">
                      Size {attendee.shirt_size}
                    </span>

                    {attendee.presenting && (
                      <span className="rounded-full bg-purple-100 px-4 py-2 font-bold text-purple-700">
                        🎤 Presenter
                      </span>
                    )}

                    {attendee.shirt_reasons?.map((reason) => (
                      <span
                        key={reason}
                        className="rounded-full bg-blue-100 px-4 py-2 font-semibold text-blue-700"
                      >
                        ⭐ {reason}
                      </span>
                    ))}

                  </div>

                </div>

                <div className="text-right">

                  {attendee.checked_in ? (
                    <>
                      <div className="mb-3 text-lg font-black text-green-700">
                        ✅ Checked In
                      </div>

                      <button
                        onClick={() => toggle(attendee)}
                        className="rounded-2xl bg-[#e02427] px-6 py-3 font-bold text-white hover:bg-red-700"
                      >
                        Undo Check-In
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggle(attendee)}
                      className="rounded-2xl bg-[#02112f] px-6 py-3 font-bold text-white hover:bg-[#0b214f]"
                    >
                      Check In
                    </button>
                  )}

                </div>

              </div>
            </div>
          ))}

      </div>
    </AppLayout>
  );
}