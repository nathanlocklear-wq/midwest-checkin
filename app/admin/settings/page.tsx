"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { staffRequest } from "@/lib/staff-api";

export default function SettingsPage() {
  const router = useRouter();

  const [badgeCutoffDate, setBadgeCutoffDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data, error } = await staffRequest<{value:string}>("settingsRead");

    if (!error && data) {
      setBadgeCutoffDate(data.value);
    }
  }

  async function saveSettings() {
    try {
      setLoading(true);

      const { error } = await staffRequest("settingsWrite", {value:badgeCutoffDate});

      if (error) throw error;

      alert("Settings saved successfully.");
    } catch (err: any) {
      alert(err.message ?? "Unable to save settings.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout
      title="Event Settings"
      subtitle="Conference Configuration"
    >
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">

        <h2 className="text-3xl font-black text-[#02112f]">
          Badge Cutoff Date
        </h2>

        <p className="mt-2 text-slate-500">
          Anyone registering after this date will be marked as
          <strong> Badge Still Needed</strong>.
        </p>

        <input
          type="date"
          value={badgeCutoffDate}
          onChange={(e) => setBadgeCutoffDate(e.target.value)}
          className="mt-6 w-full rounded-2xl border-2 border-slate-300 p-4 text-xl"
        />

        <div className="mt-8 flex gap-4">

          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex-1 rounded-2xl bg-[#02112f] py-4 text-xl font-black text-white hover:bg-[#0b214f]"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>

          <button
            onClick={() => router.push("/admin")}
            className="rounded-2xl bg-slate-200 px-8 py-4 text-xl font-black text-slate-700 hover:bg-slate-300"
          >
            Back
          </button>

        </div>

      </div>
    </AppLayout>
  );
}