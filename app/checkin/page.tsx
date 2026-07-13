"use client";

import { useState } from "react";
import Link from "next/link";

import QRScanner from "@/components/QRScanner";
import { parseVCard } from "@/lib/vcard";
import { findAttendeeByEmail } from "@/lib/storage";
import type { Attendee } from "@/types/attendee";

export default function CheckInPage() {
  const [scanning, setScanning] = useState(false);
  const [attendee, setAttendee] = useState<Attendee | null>(null);

  function startScanner() {
    setAttendee(null);
    setScanning(true);
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-6">

        <div className="rounded-2xl bg-white p-8 shadow-xl">

          <h1 className="mb-2 text-center text-4xl font-bold text-blue-900">
            MidwestTechTalk
          </h1>

          <p className="mb-8 text-center text-gray-600">
            Conference Check-In
          </p>

          <button
            onClick={startScanner}
            className="mb-4 w-full rounded-xl bg-blue-700 py-6 text-2xl font-bold text-white"
          >
            📷 Scan Badge
          </button>

          <Link
            href="/admin"
            className="mb-6 block text-center text-blue-700 underline"
          >
            Admin Dashboard
          </Link>

          {attendee && (
            <div className="rounded-xl bg-green-50 p-6 border border-green-300">

              <h2 className="text-2xl font-bold">
                {attendee.fullName}
              </h2>

              <p className="text-gray-600">
                {attendee.company}
              </p>

              <div className="mt-4">

                <div className="font-semibold">
                  Shirt
                </div>

                <div className="text-2xl font-bold">
                  {attendee.shirtType}
                </div>

                <div className="text-gray-500">
                  {attendee.shirtReasons.join(", ")}
                </div>

                <div className="mt-3">
                  Size: {attendee.shirtSize}
                </div>

              </div>

            </div>
          )}

          <QRScanner
            active={scanning}
            onScan={(text) => {
              setScanning(false);

              const card = parseVCard(text);

              if (!card) {
                alert("Invalid badge.");
                return;
              }

              const found = findAttendeeByEmail(card.email);

              if (!found) {
                alert("Attendee not found.");
                return;
              }

              setAttendee(found);
            }}
          />

        </div>

      </div>
    </main>
  );
}