"use client";

type Props = {
  onScanAgain: () => void;
};

export default function NotFoundView({
  onScanAgain,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="rounded-3xl bg-red-600 p-10 text-center text-white shadow-2xl">

        <div className="text-8xl">
          ❌
        </div>

        <h1 className="mt-6 text-5xl font-black">
          Attendee Not Found
        </h1>

        <p className="mt-6 text-2xl">
          We couldn't find a matching registration.
        </p>

        <p className="mt-3 text-lg opacity-90">
          Verify the badge or search by name.
        </p>

      </div>

      <button
        onClick={onScanAgain}
        className="w-full rounded-2xl bg-blue-700 py-6 text-2xl font-black text-white hover:bg-blue-800"
      >
        Try Again
      </button>

    </div>
  );
}