"use client";

import { useCallback, useEffect, useState } from "react";

import QRScanner from "@/components/QRScanner";
import AttendeeView from "@/components/checkin/AttendeeView";
import SuccessView from "@/components/checkin/SuccessView";
import NotFoundView from "@/components/checkin/NotFoundView";
import SearchResults from "@/components/checkin/SearchResults";

import {
  searchAttendees,
  findAttendee,
  checkInAttendee,
  getAttendees,
} from "@/lib/attendees";

import { parseVCard } from "@/lib/vcard";

import type { Attendee } from "@/lib/attendees";

type State =
  | "SEARCH"
  | "FOUND"
  | "SUCCESS"
  | "NOT_FOUND"
  | "ALREADY";

export default function CheckInWorkflow() {
  const [state, setState] = useState<State>("SEARCH");

  const [query, setQuery] = useState("");

  const [results, setResults] = useState<Attendee[]>([]);

  const [scannerOpen, setScannerOpen] = useState(false);

  const [attendee, setAttendee] =
    useState<Attendee | null>(null);

  const [total, setTotal] = useState(0);
  const [checkedIn, setCheckedIn] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const attendees = await getAttendees();

        setTotal(attendees.length);

        setCheckedIn(
          attendees.filter((a) => a.checked_in).length
        );
      } catch (e) {
        console.error(e);
      }
    }

    loadStats();
  }, []);

  useEffect(() => {
    async function doSearch() {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        const found = await searchAttendees(query);

        setResults(found);
      } catch (e) {
        console.error(e);
      }
    }

    doSearch();
  }, [query]);

  const reset = () => {
    setQuery("");
    setResults([]);
    setScannerOpen(false);
    setAttendee(null);
    setState("SEARCH");
  };

  const selectAttendee = (person: Attendee) => {
    setAttendee(person);

    if (person.checked_in) {
      setState("ALREADY");
    } else {
      setState("FOUND");
    }
  };

  const handleScan = useCallback(async (text: string) => {
    const card = parseVCard(text);

    if (!card) {
      setState("NOT_FOUND");
      return;
    }

    const found = await findAttendee(card.email);

    if (!found) {
      setState("NOT_FOUND");
      return;
    }

    selectAttendee(found);
  }, []);

  async function handleCheckIn() {
    if (!attendee) return;

    const updated = await checkInAttendee(attendee.id);

    setAttendee(updated);

    setCheckedIn((c) => c + 1);

    setState("SUCCESS");
  }

  switch (state) {
    case "FOUND":
      return (
        <AttendeeView
          attendee={attendee!}
          onCheckIn={handleCheckIn}
          onScanAgain={reset}
        />
      );

    case "SUCCESS":
      return (
        <SuccessView
          attendee={attendee!}
          onNext={reset}
        />
      );

    case "NOT_FOUND":
      return (
        <NotFoundView
          onScanAgain={reset}
        />
      );

    case "ALREADY":
      return (
        <div className="space-y-6">

          <div className="rounded-3xl bg-yellow-400 p-10 text-center shadow-2xl">

            <div className="text-8xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-5xl font-black text-black">
              Already Checked In
            </h1>

            <h2 className="mt-8 text-3xl font-bold text-black">
              {attendee?.full_name}
            </h2>

            <p className="mt-3 text-xl text-black">
              {attendee?.company}
            </p>

          </div>

          <button
            onClick={reset}
            className="w-full rounded-2xl bg-blue-700 py-6 text-2xl font-black text-white"
          >
            Next Attendee
          </button>

        </div>
      );

    default:
      return (
        <div className="space-y-6">

          <div className="rounded-3xl bg-white p-8 shadow-2xl">

            <h1 className="text-center text-4xl font-black text-slate-900">
              Check-In
            </h1>

            <p className="mt-2 text-center text-slate-500">
              Search by name, email or school
            </p>

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search attendees..."
              className="mt-8 w-full rounded-xl border-2 border-slate-300 p-4 text-xl text-slate-900 outline-none focus:border-blue-600"
            />

            <button
              onClick={() =>
                setScannerOpen(!scannerOpen)
              }
              className="mt-5 w-full rounded-xl bg-blue-700 py-4 text-xl font-bold text-white"
            >
              {scannerOpen
                ? "Close Camera"
                : "📷 Scan Badge"}
            </button>

            <div className="mt-8 grid grid-cols-3 gap-4">

              <div className="rounded-xl bg-slate-100 p-4 text-center">
                <div className="text-3xl font-black text-slate-900">
                  {total}
                </div>

                <div className="text-sm font-semibold text-slate-500">
                  Registered
                </div>
              </div>

              <div className="rounded-xl bg-green-100 p-4 text-center">
                <div className="text-3xl font-black text-green-700">
                  {checkedIn}
                </div>

                <div className="text-sm font-semibold text-green-700">
                  Checked In
                </div>
              </div>

              <div className="rounded-xl bg-blue-100 p-4 text-center">
                <div className="text-3xl font-black text-blue-700">
                  {total - checkedIn}
                </div>

                <div className="text-sm font-semibold text-blue-700">
                  Remaining
                </div>
              </div>

            </div>

          </div>

          {scannerOpen && (
            <QRScanner
              active
              onScan={handleScan}
            />
          )}

          {results.length > 0 && (
            <SearchResults
              attendees={results}
              onSelect={selectAttendee}
            />
          )}

        </div>
      );
  }
}