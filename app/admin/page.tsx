"use client";

import { useEffect, useMemo, useState } from "react";

import type { Attendee } from "@/lib/attendees";
import {
  getAttendees,
  checkInAttendee,
} from "@/lib/attendees";

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
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);

    try {
      const data = await getAttendees();
      setAttendees(data);
    } catch (error) {
      console.error("Failed to load attendees:", error);
    }

    setLoading(false);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCheckIn(id: string) {
    try {
      await checkInAttendee(id);
      await refresh();
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  }

  function handleClearStorage() {
    alert(
      "Storage clearing is disabled. Attendees are now stored in Supabase."
    );
  }


  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return attendees
      .filter((a) => {
        const matchesSearch = [
          a.full_name,
          a.email,
          a.company ?? "",
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

        if (!matchesSearch) return false;

        switch (filter) {
          case "SPECIAL":
            return a.shirt_type === "SPECIAL";

          case "STANDARD":
            return a.shirt_type === "STANDARD";

          case "LATE":
            return a.shirt_type === "LATE";

          case "NONE":
            return a.shirt_type === "NONE";

          case "CHECKED_IN":
            return a.checked_in;

          case "NEEDS_SHIRT":
            return (
              a.shirt_type === "SPECIAL" ||
              a.shirt_type === "STANDARD"
            );

          default:
            return true;
        }
      })
      .sort(
        (a, b) =>
          Number(a.checked_in) - Number(b.checked_in)
      );
  }, [attendees, search, filter]);


  const checkedIn = attendees.filter(
    (a) => a.checked_in
  ).length;


  const special = attendees.filter(
    (a) => a.shirt_type === "SPECIAL"
  ).length;


  const standard = attendees.filter(
    (a) => a.shirt_type === "STANDARD"
  ).length;


  const late = attendees.filter(
    (a) => a.shirt_type === "LATE"
  ).length;


  const none = attendees.filter(
    (a) => a.shirt_type === "NONE"
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
          {loading
            ? "Loading attendees..."
            : `Showing ${filtered.length} attendee(s)`
          }
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