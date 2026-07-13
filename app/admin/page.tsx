"use client";

import { useEffect, useMemo, useState } from "react";

import { Attendee } from "@/types/attendee";
import {
  loadAttendees,
  updateAttendee,
} from "@/lib/storage";

import AttendeeCard from "@/components/AttendeeCard";
import StatsBar from "@/components/StatsBar";
import SearchBar from "@/components/SearchBar";
import FilterBar from "@/components/FilterBar";

type Filter =
  | "ALL"
  | "NEEDS_SHIRT"
  | "SPECIAL"
  | "STANDARD"
  | "LATE"
  | "NONE"
  | "CHECKED_IN";

export default function Home() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  useEffect(() => {
    setAttendees(loadAttendees());
  }, []);

  function checkIn(id: string) {
    const updated = updateAttendee(id);
    setAttendees(updated);
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase();

    return attendees
      .filter((a) => {
        const matchesSearch =
          a.fullName.toLowerCase().includes(term) ||
          a.email.toLowerCase().includes(term) ||
          a.company.toLowerCase().includes(term) ||
          a.ticketType.toLowerCase().includes(term);

        if (!matchesSearch) return false;

        switch (filter) {
          case "SPECIAL":
            return a.shirtType === "SPECIAL";

          case "STANDARD":
            return a.shirtType === "STANDARD";

          case "LATE":
            return a.shirtType === "LATE";

          case "NONE":
            return a.shirtType === "NONE";

          case "CHECKED_IN":
            return a.checkedIn;

          case "NEEDS_SHIRT":
            return (
              a.shirtType === "SPECIAL" ||
              a.shirtType === "STANDARD"
            );

          default:
            return true;
        }
      })
      .sort((a, b) => {
        if (a.checkedIn === b.checkedIn) return 0;
        return a.checkedIn ? 1 : -1;
      });
  }, [attendees, search, filter]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">

      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-5xl font-bold text-center text-blue-900 mb-2">
          MidwestTechTalk Check-In
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Search attendees and check them in
        </p>

        <StatsBar
          total={attendees.length}
          checkedIn={attendees.filter(a => a.checkedIn).length}
        />

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
        />

        <div className="mb-4 text-gray-600">
          Showing {filtered.length} attendee(s)
        </div>

        <div className="space-y-5">

          {filtered.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
              onCheckIn={checkIn}
            />
          ))}

        </div>

      </div>

    </main>
  );
}