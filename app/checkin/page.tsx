"use client";

import AppLayout from "@/components/AppLayout";
import CheckInWorkflow from "@/components/checkin/CheckInWorkflow";

export default function CheckInPage() {
  return (
    <AppLayout
      title="Conference Check-In"
      subtitle="10th Annual Midwest Tech Talk"
    >
      <div className="mx-auto max-w-3xl">

        <CheckInWorkflow />

      </div>
    </AppLayout>
  );
}