"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { staffRequest } from "@/lib/staff-api";
import type { Attendee } from "@/lib/attendees";

export default function BadgePage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAttendees();
  }, []);

  async function loadAttendees() {
    setLoading(true);

    const { data, error } = await staffRequest<Attendee[]>("list");

    if (error) { alert(error.message); return; }
    if (!error) {
      setAttendees((data ?? []).filter(a => a.badge_still_needed));
    }

    setLoading(false);
  }

  async function badgePrinted(id: string) {
    const { error } = await staffRequest("badge", {id});

    if (error) { alert(error.message); return; }
    if (!error) {
      loadAttendees();
    }
  }

  const filtered = attendees.filter((a) => {
    const value = search.toLowerCase();

    return (
      a.full_name.toLowerCase().includes(value) ||
      (a.company ?? "").toLowerCase().includes(value) ||
      (a.email ?? "").toLowerCase().includes(value)
    );
  });

  return (
    <AppLayout
      title="Badge Still Needed"
      subtitle={`${filtered.length} attendee(s)`}
    >
      <div className="mx-auto max-w-5xl space-y-6">

        <div className="rounded-3xl bg-red-100 p-6 text-center shadow-xl">
          <div className="text-6xl font-black text-red-700">
            {filtered.length}
          </div>

          <div className="mt-2 text-xl font-bold text-red-700">
            Badges Remaining
          </div>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, company, or email..."
          className="w-full rounded-2xl border p-4 text-xl"
        />

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            Loading...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            🎉 Everyone has a badge!
          </div>
        )}

        {filtered.map((person) => (
          <div
            key={person.id}
            className="rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex-1">

                <h2 className="text-3xl font-black text-[#02112f]">
                  {person.full_name}
                </h2>

                <div className="mt-2 text-lg font-semibold text-slate-700">
                  {person.company || "No Company"}
                </div>

                <div className="text-base text-slate-500">
                  {person.email}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">

                  <span className="rounded-full bg-slate-100 px-4 py-2 font-bold">
                    👕 {person.shirt_size || "No Shirt Size"}
                  </span>

                  {person.presenting && (
                    <span className="rounded-full bg-purple-100 px-4 py-2 font-bold text-purple-700">
                      🎤 Presenter
                    </span>
                  )}

                </div>

              </div>

              <button
                onClick={() => {
                  if (
                    confirm(
                      `Mark badge as printed for ${person.full_name}?`
                    )
                  ) {
                    badgePrinted(person.id);
                  }
                }}
                className="w-full md:w-auto rounded-2xl bg-green-600 px-6 py-4 text-xl font-black text-white transition hover:bg-green-700"
              >
                🖨️ Printed
              </button>

            </div>
          </div>
        ))}

      </div>
    </AppLayout>
  );
}