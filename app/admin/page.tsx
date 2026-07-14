"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";

import { mergeAttendees } from "@/lib/mergeAttendees";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const router = useRouter();

  const [eventbriteFile, setEventbriteFile] = useState<File | null>(null);
  const [hubspotFile, setHubspotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

      const attendees = mergeAttendees(eventbrite, hubspot);

      const { error: deleteError } = await supabase
        .from("attendees")
        .delete()
        .neq("id", "");

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from("attendees")
        .insert(attendees);

      if (insertError) throw insertError;

      alert(`Imported ${attendees.length} attendees!`);

      router.push("/checkin");
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">

      <div className="border-b bg-slate-900 shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">

          <div>
            <h1 className="text-4xl font-black text-white">
              MidwestTechTalk
            </h1>

            <p className="text-slate-300">
              Conference Management
            </p>
          </div>

          <button
            onClick={() => router.push("/checkin")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Open Check-In →
          </button>

        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-6">

        <div className="mb-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Event
            </div>

            <div className="mt-3 text-3xl font-black text-slate-900">
              MidwestTechTalk
            </div>

            <div className="mt-2 text-slate-500">
              Conference Check-In System
            </div>
          </div>

          <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-lg">
            <div className="text-sm font-bold uppercase tracking-wide">
              Status
            </div>

            <div className="mt-3 text-3xl font-black">
              Ready
            </div>

            <div className="mt-2 opacity-90">
              Waiting for attendee import
            </div>
          </div>

          <div className="rounded-3xl bg-green-600 p-8 text-white shadow-lg">
            <div className="text-sm font-bold uppercase tracking-wide">
              Check-In
            </div>

            <div className="mt-3 text-3xl font-black">
              Live
            </div>

            <div className="mt-2 opacity-90">
              Mobile QR Scanner Ready
            </div>
          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2 rounded-3xl bg-white p-8 shadow-xl">

            <h2 className="text-3xl font-black text-slate-900">
              Import Attendees
            </h2>

            <p className="mt-2 text-slate-500">
              Upload the latest Eventbrite and HubSpot exports.
            </p>

            <div className="mt-8">

              <label className="mb-3 block text-lg font-bold text-slate-800">
                Eventbrite Export
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setEventbriteFile(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-slate-700"
              />

              {eventbriteFile && (
                <div className="mt-3 rounded-xl bg-green-100 p-3 font-semibold text-green-700">
                  ✓ {eventbriteFile.name}
                </div>
              )}

            </div>

            <div className="mt-8">

              <label className="mb-3 block text-lg font-bold text-slate-800">
                HubSpot Membership Export
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) =>
                  setHubspotFile(e.target.files?.[0] ?? null)
                }
                className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-slate-700"
              />

              {hubspotFile && (
                <div className="mt-3 rounded-xl bg-green-100 p-3 font-semibold text-green-700">
                  ✓ {hubspotFile.name}
                </div>
              )}

            </div>

            <button
              onClick={buildAttendees}
              disabled={loading}
              className="mt-10 w-full rounded-2xl bg-blue-700 py-5 text-2xl font-black text-white transition hover:bg-blue-800 disabled:bg-gray-400"
            >
              {loading ? "Importing..." : "📥 Import Attendees"}
            </button>

          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl">

            <h2 className="text-2xl font-black text-slate-900">
              Shirt Assignment Rules
            </h2>

            <div className="mt-6 space-y-4">

              <div className="rounded-xl bg-blue-50 p-4">
                <div className="font-bold text-blue-800">
                  SPECIAL
                </div>

                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>• District+</li>
                  <li>• Attendee+</li>
                  <li>• Committee</li>
                  <li>• Presenter Ticket</li>
                  <li>• Presenting = Yes</li>
                </ul>
              </div>

              <div className="rounded-xl bg-yellow-50 p-4">
                <div className="font-bold text-yellow-800">
                  LATE
                </div>

                <p className="mt-2 text-sm text-slate-700">
                  Late In-Person Registration
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-4">
                <div className="font-bold text-slate-800">
                  NONE
                </div>

                <p className="mt-2 text-sm text-slate-700">
                  Sponsors (unless Special)
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-4">
                <div className="font-bold text-green-800">
                  STANDARD
                </div>

                <p className="mt-2 text-sm text-slate-700">
                  Everyone else
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}