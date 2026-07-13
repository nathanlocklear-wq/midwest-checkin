"use client";

interface Props {
  onScanAgain: () => void;
}

export default function NotFoundView({
  onScanAgain,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-2xl bg-red-600 p-10 text-center text-white shadow-xl">

        <div className="text-7xl">
          ❌
        </div>

        <h1 className="mt-6 text-5xl font-black">
          ATTENDEE NOT FOUND
        </h1>

        <p className="mt-8 text-2xl">
          This badge is not in the attendee list.
        </p>

        <p className="mt-3 text-lg opacity-90">
          They may not be registered or the wrong badge was scanned.
        </p>

      </div>

      <button
        onClick={onScanAgain}
        className="w-full rounded-xl bg-blue-700 py-6 text-2xl font-bold text-white hover:bg-blue-800"
      >
        📷 Scan Another Badge
      </button>

    </div>
  );
}