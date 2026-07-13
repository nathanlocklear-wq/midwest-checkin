"use client";

import { useState } from "react";

import { parseEventbriteCsv } from "@/lib/csv";
import { parseHubSpotCsv } from "@/lib/hubspot";
import { applyMemberships } from "@/lib/import";
import { replaceAttendees } from "@/lib/storage";

interface Props {
  onImport: () => void;
}

export default function ImportWizard({
  onImport,
}: Props) {
  const [eventbriteFile, setEventbriteFile] = useState<File | null>(null);
  const [hubspotFile, setHubspotFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleImport() {
    if (!eventbriteFile) {
      alert("Please select an Eventbrite CSV.");
      return;
    }

    if (!hubspotFile) {
      alert("Please select a HubSpot CSV.");
      return;
    }

    setLoading(true);

    try {
      const eventbriteText = await eventbriteFile.text();
      const hubspotText = await hubspotFile.text();

      const attendees = parseEventbriteCsv(eventbriteText);
      const memberships = parseHubSpotCsv(hubspotText);

      const finalAttendees = applyMemberships(
        attendees,
        memberships
      );

      replaceAttendees(finalAttendees);

      alert(
        `Imported ${finalAttendees.length} attendees successfully.`
      );

      onImport();
    } catch (err) {
      console.error(err);
      alert("Import failed.");
    }

    setLoading(false);
  }

  return (
    <div className="mb-6 rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Import Conference
      </h2>

      <div className="space-y-6">

        <div>
          <label className="mb-2 block font-semibold">
            Eventbrite CSV
          </label>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setEventbriteFile(e.target.files?.[0] ?? null)
            }
          />

          {eventbriteFile && (
            <p className="mt-2 text-green-700">
              ✓ {eventbriteFile.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-semibold">
            HubSpot CSV
          </label>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setHubspotFile(e.target.files?.[0] ?? null)
            }
          />

          {hubspotFile && (
            <p className="mt-2 text-green-700">
              ✓ {hubspotFile.name}
            </p>
          )}
        </div>

        <button
          disabled={loading}
          onClick={handleImport}
          className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-gray-400"
        >
          {loading ? "Importing..." : "Import Conference"}
        </button>

      </div>

    </div>
  );
}