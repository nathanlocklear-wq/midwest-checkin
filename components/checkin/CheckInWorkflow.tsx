"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import QRScanner from "@/components/QRScanner";
import AttendeeView from "@/components/checkin/AttendeeView";
import SuccessView from "@/components/checkin/SuccessView";
import NotFoundView from "@/components/checkin/NotFoundView";
import SearchResults from "@/components/checkin/SearchResults";

import {
  searchAttendees,
  findAttendee,
  checkInAttendee,
  undoCheckInAttendee,
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
  const [attendee, setAttendee] = useState<Attendee | null>(null);

  const [total, setTotal] = useState(0);
  const [checkedIn, setCheckedIn] = useState(0);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const attendees = await getAttendees();

        setTotal(attendees.length);

        setCheckedIn(
          attendees.filter((a) => a.checked_in).length
        );
      } catch (err) {
        console.error(err);
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
      } catch (err) {
        console.error(err);
      }
    }

    doSearch();
  }, [query]);

  useEffect(() => {
    if (state === "SEARCH") {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 50);
    }
  }, [state]);

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

  async function handleUndoCheckIn() {
    if (!attendee) return;

    const updated = await undoCheckInAttendee(attendee.id);

    setAttendee(updated);
    setCheckedIn((c) => Math.max(0, c - 1));
    setState("SEARCH");
    reset();
  }

  function handleSearchKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter" && results.length === 1) {
      selectAttendee(results[0]);
    }

    if (e.key === "Escape") {
      setQuery("");
      setResults([]);
    }
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

          <div className="rounded-3xl bg-yellow-300 p-10 text-center shadow-2xl">

            <div className="text-8xl">
              ⚠️
            </div>

            <h1 className="mt-6 text-5xl font-black text-black">
              Already Checked In
            </h1>

            <h2 className="mt-8 text-4xl font-bold text-black">
              {attendee?.full_name}
            </h2>

            <p className="mt-3 text-xl text-black">
              {attendee?.company}
            </p>

          </div>


          <button
            onClick={handleUndoCheckIn}
            className="w-full rounded-2xl bg-[#e02427] py-6 text-2xl font-black text-white hover:bg-red-700"
          >
            ↩️ Undo Check-In
          </button>


          <button
            onClick={reset}
            className="w-full rounded-2xl bg-[#02112f] py-6 text-2xl font-black text-white hover:bg-[#0b214f]"
          >
            Next Attendee
          </button>

        </div>
      );

    default:
      return (
        <div className="space-y-6">

          <div className="rounded-3xl bg-white p-8 shadow-2xl">

            <div className="mb-8 text-center">

              <h1 className="text-5xl font-black text-[#02112f]">
                Attendee Check-In
              </h1>

              <p className="mt-3 text-lg text-slate-500">
                Search by attendee name, email, or organization
              </p>

            </div>

            <input
              ref={searchRef}
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search attendees..."
              className="w-full rounded-2xl border-2 border-slate-300 p-5 text-2xl font-semibold text-slate-900 transition focus:border-[#e02427] focus:outline-none"
            />

            <button
              onClick={() => setScannerOpen(!scannerOpen)}
              className="mt-5 w-full rounded-2xl bg-[#02112f] py-5 text-xl font-bold text-white transition hover:bg-[#0b214f]"
            >
              {scannerOpen
                ? "Close QR Scanner"
                : "📷 Scan Badge QR Code"}
            </button>

            <div className="mt-8 grid grid-cols-3 gap-5">

              <div className="rounded-2xl bg-slate-100 p-5 text-center shadow">
                <div className="text-4xl font-black text-[#02112f]">
                  {total}
                </div>

                <div className="mt-2 text-sm font-bold uppercase text-slate-500">
                  Registered
                </div>
              </div>

              <div className="rounded-2xl bg-green-100 p-5 text-center shadow">
                <div className="text-4xl font-black text-green-700">
                  {checkedIn}
                </div>

                <div className="mt-2 text-sm font-bold uppercase text-green-700">
                  Checked In
                </div>
              </div>

              <div className="rounded-2xl bg-red-100 p-5 text-center shadow">
                <div className="text-4xl font-black text-[#e02427]">
                  {total - checkedIn}
                </div>

                <div className="mt-2 text-sm font-bold uppercase text-[#e02427]">
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