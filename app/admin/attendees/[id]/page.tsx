"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { staffRequest } from "@/lib/staff-api";
import type { Attendee } from "@/lib/attendees";

export default function EditAttendeePage() {
  const { id } = useParams();
  const router = useRouter();

  const [attendee, setAttendee] = useState<Attendee | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await staffRequest<Attendee>("get", {id});

    setAttendee(data);
  }

  async function save() {
    if (!attendee) return;
    const { error } = await staffRequest("update", {id, changes: {
        company: attendee.company,
        email: attendee.email,
        shirt_size: attendee.shirt_size,
        badge_still_needed: attendee.badge_still_needed,
        presenting: attendee.presenting,
      }});

    if (error) { alert(error.message); return; }
    if (!error) {
      alert("Saved!");
      router.push("/admin/attendees");
    }
  }

  if (!attendee) {
    return (
      <AppLayout title="Loading..." subtitle="">
        Loading...
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={attendee.full_name}
      subtitle="Edit Attendee"
    >
      <div className="mx-auto max-w-2xl space-y-6">

        <div>
          <label className="font-bold">Company</label>

          <input
            value={attendee.company ?? ""}
            onChange={(e) =>
              setAttendee({
                ...attendee,
                company: e.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border p-4"
          />
        </div>

        <div>
          <label className="font-bold">Email</label>

          <input
            value={attendee.email ?? ""}
            onChange={(e) =>
              setAttendee({
                ...attendee,
                email: e.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border p-4"
          />
        </div>

        <div>
          <label className="font-bold">Shirt Size</label>

          <select
            value={attendee.shirt_size ?? ""}
            onChange={(e) =>
              setAttendee({
                ...attendee,
                shirt_size: e.target.value,
              })
            }
            className="mt-2 w-full rounded-xl border p-4"
          >
            <option value="">None</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>2XL</option>
            <option>3XL</option>
            <option>4XL</option>
        </select>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={attendee.badge_still_needed}
            onChange={(e) =>
              setAttendee({
                ...attendee,
                badge_still_needed: e.target.checked,
              })
            }
          />
          Badge Still Needed
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={attendee.presenting}
            onChange={(e) =>
              setAttendee({
                ...attendee,
                presenting: e.target.checked,
              })
            }
          />
          Presenter
        </label>

        <button
          onClick={save}
          className="w-full rounded-2xl bg-[#02112f] py-5 text-2xl font-black text-white"
        >
          Save Changes
        </button>

      </div>
    </AppLayout>
  );
}