"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppLayout from "@/components/AppLayout";
import { getAttendees } from "@/lib/attendees";
import type { Attendee } from "@/lib/attendees";

export default function AttendeesPage() {
  const router = useRouter();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data = await getAttendees();
    setAttendees(data);
  }

  const filtered = attendees.filter((a) =>
    `${a.full_name} ${a.company} ${a.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <AppLayout
      title="Attendee Manager"
      subtitle={`${filtered.length} attendee(s)`}
    >
      <div className="mx-auto max-w-5xl space-y-6">

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search attendees..."
          className="w-full rounded-2xl border p-5 text-xl"
        />

        {filtered.map((attendee) => (
          <div
            key={attendee.id}
            className="rounded-3xl bg-white p-6 shadow-xl"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

              <div>

                <h2 className="text-2xl font-black text-[#02112f]">
                  {attendee.full_name}
                </h2>

                <p className="mt-2 text-lg font-semibold text-slate-700">
  {attendee.company || "No Company"}
</p>

<p className="text-base text-slate-500">
  {attendee.email}
</p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {attendee.badge_still_needed && (
                    <span className="rounded-full bg-red-100 px-3 py-1 font-bold text-red-800">
  🪪 Badge Still Needed
</span>
                  )}

                  {attendee.checked_in && (
                    <span className="rounded-full bg-green-100 px-3 py-1 font-bold text-green-800">
  ✅ Checked In
</span>
                  )}

                  <span className="rounded-full bg-slate-200 px-3 py-1 font-bold text-[#02112f]">
  👕 {attendee.shirt_size || "No Shirt Size"}
</span>

                </div>

              </div>

              <button
  onClick={() =>
    router.push(`/admin/attendees/${attendee.id}`)
  }
  className="w-full md:w-auto rounded-xl bg-[#02112f] px-6 py-3 font-bold text-white hover:bg-[#0b214f]"
>
  Edit
</button>

            </div>
          </div>
        ))}

        <button
          onClick={() => router.push("/admin")}
          className="w-full rounded-2xl bg-[#02112f] py-5 text-2xl font-black text-white"
        >
          Back
        </button>

      </div>
    </AppLayout>
  );
}