"use client";

type Props = {
  onScanAgain: () => void;
};

export default function NotFoundView({
  onScanAgain,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-white p-10 text-center shadow-2xl">

        <div className="text-8xl">❌</div>

        <h1 className="mt-6 text-5xl font-black text-[#e02427]">
          Attendee Not Found
        </h1>

        <p className="mt-6 text-2xl text-slate-700">
          No matching attendee was found.
        </p>

        <p className="mt-3 text-lg text-slate-500">
          Check the spelling, search by email, or scan the badge again.
        </p>

      </div>

      <button
        onClick={onScanAgain}
        className="w-full rounded-2xl bg-[#02112f] py-6 text-2xl font-black text-white transition hover:bg-[#0b214f]"
      >
        ← Back to Search
      </button>

    </div>
  );
}