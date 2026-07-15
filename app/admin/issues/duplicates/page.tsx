"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppLayout from "@/components/AppLayout";
import { getAttendees } from "@/lib/attendees";
import { findDuplicates } from "@/lib/findDuplicates";
import { supabase } from "@/lib/supabase";

import type { Attendee } from "@/lib/attendees";
import type { DuplicateGroup } from "@/lib/findDuplicates";

export default function DuplicateRegistrationsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDuplicates();
  }, []);

  async function loadDuplicates() {
    setLoading(true);

    const attendees = await getAttendees();

    const duplicateGroups = findDuplicates(attendees);

    setGroups(duplicateGroups);

    setLoading(false);
  }

  async function deleteAttendee(id: string) {
    const confirmed = confirm(
      "Are you sure you want to delete this registration?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("attendees")
      .delete()
      .eq("id", id);

    if (!error) {
      loadDuplicates();
    }
  }

  return (
    <AppLayout
      title="Duplicate Registrations"
      subtitle={`${groups.length} duplicate group(s)`}
    >
      <div className="mx-auto max-w-5xl space-y-6">

        <button
          onClick={() => router.push("/admin/issues")}
          className="rounded-2xl bg-[#02112f] px-6 py-3 font-black text-white hover:bg-[#0b214f]"
        >
          ← Back to Registration Issues
        </button>

        {loading && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl text-[#02112f]">
            Loading duplicates...
          </div>
        )}

        {!loading && groups.length === 0 && (
          <div className="rounded-3xl bg-green-100 p-10 text-center shadow-xl">
            <div className="text-5xl">
              🎉
            </div>

            <div className="mt-4 text-3xl font-black text-green-700">
              No Duplicate Registrations
            </div>
          </div>
        )}

        {groups.map((group, index) => (
          <div
            key={index}
            className="rounded-3xl bg-white p-8 shadow-xl"
          >

            <div className="mb-6">

              <div className="text-sm font-black uppercase text-slate-500">
                Issue
              </div>

              <div className="text-2xl font-black text-[#02112f]">
                {group.reason}
              </div>

            </div>


            <div className="space-y-4">

              {group.attendees.map((person: Attendee) => (

                <div
                  key={person.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>

                      <div className="text-2xl font-black text-[#02112f]">
                        {person.full_name}
                      </div>

                      <div className="text-slate-600">
                        {person.company || "No Company"}
                      </div>

                      <div className="text-slate-500">
                        {person.email || "No Email"}
                      </div>

                      <div className="mt-1 text-sm font-bold text-slate-400">
                        {person.ticket_type}
                      </div>

                    </div>


                    <button
                      onClick={() => deleteAttendee(person.id)}
                      className="rounded-2xl bg-red-600 px-6 py-4 font-black text-white hover:bg-red-700"
                    >
                      Delete Registration
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>
        ))}

      </div>
    </AppLayout>
  );
}