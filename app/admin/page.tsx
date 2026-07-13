"use client";

import { useEffect, useMemo, useState } from "react";

import { Attendee } from "@/types/attendee";
import {
  loadAttendees,
  checkInAttendee,
  clearAttendees,
} from "@/lib/storage";

import AdminToolbar from "@/components/AdminToolbar";
import AttendeeCard from "@/components/AttendeeCard";
import StatsCards from "@/components/StatsCards";
import SearchBar from "@/components/SearchBar";
import FilterBar, { Filter } from "@/components/FilterBar";
import ImportWizard from "@/components/ImportWizard";

export default function AdminPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  function refresh() {
    setAttendees(loadAttendees());
  }

  useEffect(() => {
    refresh();
  }, []);

  function handleCheckIn(id: string) {
    const updated = checkInAttendee(id);
    setAttendees(updated);
  }

  function handleClearStorage() {
    if (!confirm("Clear all attendee data from this browser?")) {
      return;
    }

    clearAttendees();
    setAttendees([]);
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return attendees
      .filter((a) => {
        const matchesSearch = [
          a.fullName,
          a.email,
          a.company,
          a.ticketType,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

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
      .sort((a, b) => Number(a.checkedIn) - Number(b.checkedIn));
  }, [attendees, search, filter]);

  const checkedIn = attendees.filter((a) => a.checkedIn).length;

const special = attendees.filter(
  (a) => a.shirtType === "SPECIAL"
).length;

const standard = attendees.filter(
  (a) => a.shirtType === "STANDARD"
).length;

const late = attendees.filter(
  (a) => a.shirtType === "LATE"
).length;

const none = attendees.filter(
  (a) => a.shirtType === "NONE"
).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-6xl p-8">
        <h1 className="mb-2 text-center text-5xl font-bold text-blue-900">
          MidwestTechTalk Admin
        </h1>

        <p className="mb-8 text-center text-gray-600">
          Manage conference attendees
        </p>

        <AdminToolbar
          total={attendees.length}
          checkedIn={checkedIn}
          onRefresh={refresh}
          onClear={handleClearStorage}
        />

<ImportWizard
  onImport={refresh}
/>

        <StatsCards
  total={attendees.length}
  checkedIn={checkedIn}
  special={special}
  standard={standard}
  late={late}
  none={none}
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
              onCheckIn={handleCheckIn}
            />
          ))}
        </div>
      </div>
    </main>
  );
}