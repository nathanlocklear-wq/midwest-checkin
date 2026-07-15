"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppLayout from "@/components/AppLayout";
import { getAttendees } from "@/lib/attendees";
import type { Attendee } from "@/lib/attendees";

export default function MissingCompanyPage() {
  const router = useRouter();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAttendees();
  }, []);

  async function loadAttendees() {
    setLoading(true);

    const all = await getAttendees();

    setAttendees(
      all.filter(
        (a) => !a.company || a.company.trim() === ""
      )
    );

    setLoading(false);
  }

  const filtered = attendees.filter((a) => {
    const value = search.toLowerCase();

    return (
      a.full_name.toLowerCase().includes(value) ||
      a.email.toLowerCase().includes(value)
    );
  });

  return (
    <AppLayout
      title="Missing Company"
      subtitle={`${filtered.length} attendee(s)`}
    >
      <div className="mx-auto max-w-5xl space-y-6">

        <button
          onClick={() => router.push("/admin/issues")}
          className="rounded-2xl bg-[#02112f] px-6 py-3 font-black text-white hover:bg-[#0b214f]"
        >
          ← Back to Registration Issues
        </button>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-2xl border p-4 text-xl"
        />

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            Loading...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            🎉 No attendees are missing a company.
          </div>
        )}

        {filtered.map((person) => (
          <div
            key={person.id}
            className="rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-3xl font-black text-[#02112f]">
                  {person.full_name}
                </h2>

                <div className="mt-2 text-slate-500">
                  {person.email}
                </div>

              </div>

              <button
                onClick={() =>
                  router.push(`/admin/attendees?id=${person.id}`)
                }
                className="rounded-2xl bg-[#02112f] px-6 py-4 text-xl font-black text-white hover:bg-[#0b214f]"
              >
                Edit
              </button>

            </div>
          </div>
        ))}

      </div>
    </AppLayout>
  );
}