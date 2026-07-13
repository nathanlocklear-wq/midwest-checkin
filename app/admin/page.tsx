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

      // Remove all existing attendees
      const { error: deleteError } = await supabase
        .from("attendees")
        .delete()
        .neq("id", "");

      if (deleteError) {
        throw deleteError;
      }

      // Upload the new attendee list
      const { error: insertError } = await supabase
        .from("attendees")
        .insert(attendees);

      if (insertError) {
        throw insertError;
      }

      alert(`Successfully imported ${attendees.length} attendees.`);

      router.push("/checkin");
    } catch (err) {
      console.error("Import failed:", err);

      if (err instanceof Error) {
        alert(`Import failed:\n\n${err.message}`);
      } else {
        alert("Failed to import attendees.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-center text-5xl font-bold text-blue-900">
          MidwestTechTalk Admin
        </h1>

        <p className="mt-3 text-center text-gray-600">
          Upload the latest Eventbrite and HubSpot exports.
        </p>

        <div className="mt-10 rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8">
            <label className="mb-2 block font-semibold">
              Eventbrite Registration Export
            </label>

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setEventbriteFile(e.target.files?.[0] ?? null)
              }
              className="block w-full rounded-lg border p-3"
            />

            {eventbriteFile && (
              <p className="mt-2 text-sm text-green-700">
                ✓ {eventbriteFile.name}
              </p>
            )}
          </div>

          <div className="mb-8">
            <label className="mb-2 block font-semibold">
              HubSpot Membership Export
            </label>

            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setHubspotFile(e.target.files?.[0] ?? null)
              }
              className="block w-full rounded-lg border p-3"
            />

            {hubspotFile && (
              <p className="mt-2 text-sm text-green-700">
                ✓ {hubspotFile.name}
              </p>
            )}
          </div>

          <button
            onClick={buildAttendees}
            disabled={loading}
            className="w-full rounded-xl bg-blue-700 py-4 text-xl font-bold text-white hover:bg-blue-800 disabled:bg-gray-400"
          >
            {loading ? "Uploading Attendees..." : "Build Attendee List"}
          </button>
        </div>

        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-3 text-lg font-bold">
            Shirt Logic
          </h2>

          <ul className="ml-6 list-disc space-y-1 text-sm">
            <li>District+ → SPECIAL</li>
            <li>Attendee+ → SPECIAL</li>
            <li>Committee → SPECIAL</li>
            <li>Presenter Ticket → SPECIAL</li>
            <li>"Are you presenting?" = Yes → SPECIAL</li>
            <li>Sponsor → NONE (unless Special)</li>
            <li>LATE In-Person → LATE (unless Special)</li>
            <li>In-Person → STANDARD</li>
          </ul>
        </div>
      </div>
    </main>
  );
}