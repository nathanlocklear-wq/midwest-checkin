"use client";

import { useCallback, useState } from "react";

import QRScanner from "@/components/QRScanner";
import AttendeeView from "@/components/checkin/AttendeeView";
import SuccessView from "@/components/checkin/SuccessView";
import NotFoundView from "@/components/checkin/NotFoundView";

import {
  findAttendeeByEmail,
  checkInAttendeeByEmail,
} from "@/lib/storage";

import { parseVCard } from "@/lib/vcard";
import type { Attendee } from "@/types/attendee";

type State =
  | "SCANNING"
  | "FOUND"
  | "SUCCESS"
  | "NOT_FOUND"
  | "ALREADY";

export default function CheckInWorkflow() {
  const [state, setState] = useState<State>("SCANNING");
  const [attendee, setAttendee] = useState<Attendee | null>(null);

  const scanAgain = useCallback(() => {
    setAttendee(null);
    setState("SCANNING");
  }, []);

  const handleScan = useCallback((text: string) => {
    const card = parseVCard(text);

    if (!card) {
      setState("NOT_FOUND");
      return;
    }

    const found = findAttendeeByEmail(card.email);

    if (!found) {
      setState("NOT_FOUND");
      return;
    }

    setAttendee(found);

    if (found.checkedIn) {
      setState("ALREADY");
      return;
    }

    setState("FOUND");
  }, []);

  function handleCheckIn() {
    if (!attendee) return;

    const updated = checkInAttendeeByEmail(attendee.email);

    if (!updated) return;

    setAttendee(updated);
    setState("SUCCESS");
  }

  switch (state) {
    case "FOUND":
      return (
        <AttendeeView
          attendee={attendee!}
          onCheckIn={handleCheckIn}
          onScanAgain={scanAgain}
        />
      );

    case "SUCCESS":
      return (
        <SuccessView
          attendee={attendee!}
          onNext={scanAgain}
        />
      );

    case "NOT_FOUND":
      return (
        <NotFoundView
          onScanAgain={scanAgain}
        />
      );

    case "ALREADY":
      return (
        <div className="space-y-6">

          <div className="rounded-2xl bg-yellow-400 p-10 text-center shadow">

            <div className="text-7xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-5xl font-black">
              Already Checked In
            </h1>

            <div className="mt-8 text-3xl font-bold">
              {attendee?.fullName}
            </div>

            <div className="mt-4 text-xl">
              {attendee?.checkedInAt &&
                new Date(
                  attendee.checkedInAt
                ).toLocaleTimeString()}
            </div>

          </div>

          <button
            onClick={scanAgain}
            className="w-full rounded-xl bg-blue-700 py-6 text-2xl font-bold text-white"
          >
            📷 Scan Another Badge
          </button>

        </div>
      );

    default:
      return (
        <div>

          <QRScanner
            active={true}
            onScan={handleScan}
          />

          <p className="mt-6 text-center text-xl text-white">
            Point the camera at a badge.
          </p>

        </div>
      );
  }
}