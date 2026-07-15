"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { findDuplicates } from "@/lib/findDuplicates";
import {
  getAttendees,
  getBadgeStillNeededCount,
  getDuplicateAttendees,
  getCheckedInCount,
} from "@/lib/attendees";

import AppLayout from "@/components/AppLayout";
import { mergeAttendees } from "@/lib/mergeAttendees";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [eventbriteFile, setEventbriteFile] = useState<File | null>(null);
  const [hubspotFile, setHubspotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(0);
  const [checkedIn, setCheckedIn] = useState(0);
  const [badgesNeeded, setBadgesNeeded] = useState(0);
  const [duplicates, setDuplicates] = useState(0);

  function parseCsv(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          resolve(results.data as any[]);
        },
        error(error) {
          reject(error);
        },
      });
    });
  }

  useEffect(() => {
  loadDashboard();
}, []);

async function loadDashboard() {
  try {
    const attendees = await getAttendees();
    const badgeCount = await getBadgeStillNeededCount();
    const duplicateGroups = await getDuplicateAttendees();
    const checkedInCount = await getCheckedInCount();

    setRegistered(attendees.length);
    setCheckedIn(checkedInCount);
    setBadgesNeeded(badgeCount);
    setDuplicates(duplicateGroups.length);
  } catch (err) {
    console.error(err);
  }
}

  async function buildAttendees() {
    if (!eventbriteFile) {
      alert("Please select the Eventbrite CSV.");
      return;
    }

    if (!hubspotFile) {
      alert("Please select the HubSpot CSV.");
      return;
    }

    try {
      setLoading(true);

      const eventbrite = await parseCsv(eventbriteFile);
      const hubspot = await parseCsv(hubspotFile);

      const { data: setting, error: settingsError } = await supabase
  .from("settings")
  .select("value")
  .eq("key", "badge_cutoff_date")
  .single();

if (settingsError || !setting) {
  throw new Error(
    "Badge cutoff date is not configured."
  );
}

const attendees = mergeAttendees(
  eventbrite,
  hubspot,
  setting.value
);
const duplicateGroups = findDuplicates(attendees);

      const { error: deleteError } = await supabase
        .from("attendees")
        .delete()
        .neq("id", "");

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("attendees")
        .insert(attendees);

      if (insertError) throw insertError;
      const badgeCount = attendees.filter(
  (a) => a.badge_still_needed
).length;

const duplicateCount = duplicateGroups.length;

await loadDashboard();

setEventbriteFile(null);
setHubspotFile(null);

alert(
  `Import Complete!\n\n` +
  `Imported: ${attendees.length}\n` +
  `Badge Still Needed: ${badgeCount}\n` +
  `Possible Duplicates: ${duplicateCount}`
);

} catch (err: any) {
  console.error(err);
  alert(err.message ?? "Import failed.");
} finally {
  setLoading(false);
}

}

  return (
    <AppLayout
      title="Conference Administration"
      subtitle="Manage registrations and attendee imports"
    >
      <div className="mb-8 grid gap-4 grid-cols-2 xl:grid-cols-4">

  <div className="rounded-3xl bg-white p-6 shadow-xl text-center">
    <div className="text-5xl font-black text-[#02112f]">
      {registered}
    </div>
    <div className="mt-2 font-bold text-slate-500">
      Registered
    </div>
  </div>

  <div className="rounded-3xl bg-green-100 p-6 shadow-xl text-center">
    <div className="text-5xl font-black text-green-700">
      {checkedIn}
    </div>
    <div className="mt-2 font-bold text-green-700">
      Checked In
    </div>
  </div>

  <div className="rounded-3xl bg-red-100 p-6 shadow-xl text-center">
    <div className="text-5xl font-black text-red-700">
      {badgesNeeded}
    </div>
    <div className="mt-2 font-bold text-red-700">
      Badge Still Needed
    </div>
  </div>

  <div className="rounded-3xl bg-yellow-100 p-6 shadow-xl text-center">
    <div className="text-5xl font-black text-yellow-700">
      {duplicates}
    </div>
    <div className="mt-2 font-bold text-yellow-700">
      Duplicate Emails
    </div>
  </div>

</div>
      <div className="grid gap-8 lg:grid-cols-3">

        <div className="rounded-3xl bg-white p-8 shadow-2xl lg:col-span-2">

          <div className="mb-8 flex justify-between items-center">

            <div>
              <h2 className="text-3xl font-black text-[#02112f]">
                Import Attendees
              </h2>

              <p className="mt-2 text-slate-500">
                Upload Eventbrite and HubSpot exports.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">

  <button
    onClick={() => router.push("/checkin")}
    className="rounded-2xl bg-[#e02427] px-6 py-4 font-bold text-white hover:bg-red-700"
  >
    📷 Check-In
  </button>

  <button
    onClick={() => router.push("/admin/badges")}
    className="rounded-2xl bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700"
  >
    🪪 Badge Still Needed
  </button>

  <button
    onClick={() => router.push("/admin/issues")}
    className="rounded-2xl bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
  >
    ⚠️ Registration Issues
  </button>

  <button
    onClick={() => router.push("/admin/settings")}
    className="rounded-2xl bg-slate-700 px-6 py-4 font-bold text-white hover:bg-slate-800"
  >
    ⚙️ Event Settings
  </button>

  <button
    onClick={() => router.push("/admin/attendees")}
    className="rounded-2xl bg-blue-700 px-6 py-4 font-bold text-white hover:bg-blue-800"
  >
    👥 Attendee Manager
  </button>

</div>
          </div>

          <div className="space-y-8">

            <div>
              <label className="mb-3 block text-lg font-black text-[#02112f]">
                Eventbrite Export
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setEventbriteFile(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-slate-700"
              />

              {eventbriteFile && (
                <div className="mt-3 rounded-xl bg-green-100 p-3 font-semibold text-green-700">
                  ✓ {eventbriteFile.name}
                </div>
              )}

            </div>


            <div>
              <label className="mb-3 block text-lg font-black text-[#02112f]">
                HubSpot Membership Export
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setHubspotFile(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-slate-700"
              />

              {hubspotFile && (
                <div className="mt-3 rounded-xl bg-green-100 p-3 font-semibold text-green-700">
                  ✓ {hubspotFile.name}
                </div>
              )}

            </div>

          </div>

          <button
            onClick={buildAttendees}
            disabled={loading}
            className="mt-10 w-full rounded-2xl bg-[#02112f] py-5 text-2xl font-black text-white transition hover:bg-[#0b214f] disabled:bg-gray-400"
          >
            {loading ? "Importing..." : "📥 Import Attendees"}
          </button>

        </div>


        <div className="rounded-3xl bg-white p-8 shadow-2xl">

          <h2 className="text-2xl font-black text-[#02112f]">
            Shirt Assignment Rules
          </h2>

          <div className="mt-6 space-y-4">

            <RuleCard
  title="⭐ SPECIAL"
  color="bg-red-50 text-red-700"
  items={[
    "Committee",
    "Presenter Ticket",
    "Marked as Presenter",
  ]}
/>

<RuleCard
  title="🕒 LATE"
  color="bg-yellow-50 text-yellow-700"
  items={[
    "Late Registration",
  ]}
/>

<RuleCard
  title="🚫 NONE"
  color="bg-slate-100 text-slate-700"
  items={[
    "Sponsor",
  ]}
/>

<RuleCard
  title="👕 STANDARD"
  color="bg-green-100 text-green-700"
  items={[
    "In-Person Attendee",
    "Attendee+",
    "District+",
  ]}
/>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}


function RuleCard({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div className={`rounded-2xl p-5 ${color}`}>

      <div className="font-black">
        {title}
      </div>

      <ul className="mt-3 space-y-1 text-sm font-medium">
        {items.map((item) => (
          <li key={item}>
            • {item}
          </li>
        ))}
      </ul>

    </div>
  );
}