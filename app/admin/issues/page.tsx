"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppLayout from "@/components/AppLayout";
import { getAttendees } from "@/lib/attendees";

export default function RegistrationIssuesPage() {
  const router = useRouter();

  const [badgeNeeded, setBadgeNeeded] = useState(0);
  const [missingCompany, setMissingCompany] = useState(0);
  const [missingShirt, setMissingShirt] = useState(0);
  const [missingEmail, setMissingEmail] = useState(0);
  const [duplicates, setDuplicates] = useState(0);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const attendees = await getAttendees();

    setBadgeNeeded(
      attendees.filter((a) => a.badge_still_needed).length
    );

    setMissingCompany(
      attendees.filter(
        (a) => !a.company || a.company.trim() === ""
      ).length
    );

    setMissingShirt(
      attendees.filter(
        (a) =>
          a.shirt_type !== "NONE" &&
          (!a.shirt_size || a.shirt_size.trim() === "")
      ).length
    );

    setMissingEmail(
      attendees.filter(
        (a) => !a.email || a.email.trim() === ""
      ).length
    );

    const duplicateEmails = new Set<string>();

    attendees.forEach((a) => {
      if (!a.email) return;

      const email = a.email.toLowerCase();

      if (
        attendees.filter(
          (b) => b.email?.toLowerCase() === email
        ).length > 1
      ) {
        duplicateEmails.add(email);
      }
    });

    setDuplicates(duplicateEmails.size);
  }

  return (
    <AppLayout
      title="Registration Issues"
      subtitle="Things to review before the conference"
    >
      <div className="mx-auto max-w-3xl space-y-5">

        <IssueCard
          title="🪪 Badge Still Needed"
          count={badgeNeeded}
          color="bg-red-100"
          onClick={() => router.push("/admin/badges")}
        />

        <IssueCard
          title="🏢 Missing Company"
          count={missingCompany}
          color="bg-orange-100"
          onClick={() => router.push("/admin/issues/company")}
        />

        <IssueCard
          title="👕 Missing Shirt Size"
          count={missingShirt}
          color="bg-yellow-100"
          onClick={() => router.push("/admin/issues/shirts")}
        />

        <IssueCard
          title="📧 Missing Email"
          count={missingEmail}
          color="bg-blue-100"
          onClick={() => router.push("/admin/issues/email")}
        />

        <IssueCard
          title="👥 Duplicate Registrations"
          count={duplicates}
          color="bg-red-100"
          onClick={() => router.push("/admin/issues/duplicates")}
        />

        <button
          onClick={() => router.push("/admin")}
          className="w-full rounded-2xl bg-[#02112f] py-5 text-2xl font-black text-white hover:bg-[#0b214f]"
        >
          ← Back to Admin
        </button>

      </div>
    </AppLayout>
  );
}

function IssueCard({
  title,
  count,
  color,
  onClick,
}: {
  title: string;
  count: number;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full ${color} rounded-3xl p-6 shadow-xl transition hover:scale-[1.01] hover:shadow-2xl`}
    >
      <div className="flex items-center justify-between">

        <div className="text-left text-2xl font-black text-[#02112f]">
          {title}
        </div>

        <div className="text-4xl font-black text-[#02112f]">
          {count}
        </div>

      </div>
    </button>
  );
}