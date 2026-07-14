"use client";

import { useEffect, useMemo, useState } from "react";

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

    return attendees.filter((a) =>
      a.full_name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q)
    );
  }, [attendees, search]);

  async function toggle(attendee: Attendee) {
    let updated: Attendee;

    if (attendee.checked_in) {
      updated = await undoCheckInAttendee(attendee.id);
    } else {
      updated = await checkInAttendee(attendee.id);
    }

    setAttendees((current) =>
      current.map((a) =>
        a.id === updated.id ? updated : a
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="border-b bg-slate-900">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">

          <div>

            <h1 className="text-4xl font-black text-white">
              Attendee Manager
            </h1>

            <p className="text-slate-300">
              Search • Check In • Undo Check-In
            </p>

          </div>

          <a
            href="/admin"
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            ← Back
          </a>

        </div>

      </div>

      <div className="mx-auto max-w-7xl p-8">

        <div className="mb-8 rounded-2xl bg-white p-6 shadow">

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search name, company or email..."
            className="w-full rounded-xl border p-4 text-lg text-slate-900"
          />

        </div>

        <div className="mb-4 font-bold text-slate-600">
          {filtered.length} Attendees
        </div>

        <div className="space-y-4">

          {loading && (
            <div className="rounded-xl bg-white p-8 shadow">
              Loading...
            </div>
          )}

          {!loading &&
            filtered.map((attendee) => (
              <div
                key={attendee.id}
                className="rounded-2xl bg-white p-6 shadow"
              >

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div>

                    <h2 className="text-2xl font-black text-slate-900">
                      {attendee.full_name}
                    </h2>

                    <p className="text-slate-600">
                      {attendee.company}
                    </p>

                    <p className="text-sm text-slate-500">
                      {attendee.email}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-800">
                        {attendee.shirt_type}
                      </span>

                      <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                        {attendee.shirt_size}
                      </span>

                      {attendee.presenting && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 font-semibold text-purple-700">
                          Presenter
                        </span>
                      )}

                    </div>

                  </div>

                  <div className="text-right">

                    {attendee.checked_in ? (

                      <>
                        <div className="mb-3 font-bold text-green-700">
                          ✓ Checked In
                        </div>

                        <button
                          onClick={() => toggle(attendee)}
                          className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
                        >
                          Undo Check-In
                        </button>
                      </>

                    ) : (

                      <button
                        onClick={() => toggle(attendee)}
                        className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
                      >
                        Check In
                      </button>

                    )}

                  </div>

                </div>

              </div>
            ))}

        </div>

      </div>

    </main>
  );
}