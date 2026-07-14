interface Props {
  total: number;
  checkedIn: number;
  onRefresh: () => void;
  onClear: () => void;
}

export default function AdminToolbar({
  total,
  checkedIn,
  onRefresh,
  onClear,
}: Props) {
  const remaining = total - checkedIn;
  const percent =
    total === 0 ? 0 : Math.round((checkedIn / total) * 100);

  return (
    <div className="mb-8 rounded-3xl bg-white p-8 shadow-2xl">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-3xl font-black text-[#02112f]">
            Conference Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Live registration overview
          </p>

        </div>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={onRefresh}
            className="rounded-2xl bg-[#02112f] px-6 py-3 font-bold text-white transition hover:bg-[#0b214f]"
          >
            🔄 Refresh
          </button>

          <button
            onClick={onClear}
            className="rounded-2xl bg-[#e02427] px-6 py-3 font-bold text-white transition hover:bg-red-700"
          >
            🗑 Clear Storage
          </button>

        </div>

      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-slate-100 p-6 text-center">

          <div className="text-5xl font-black text-[#02112f]">
            {total}
          </div>

          <div className="mt-2 font-bold uppercase tracking-wide text-slate-500">
            Registered
          </div>

        </div>

        <div className="rounded-2xl bg-green-100 p-6 text-center">

          <div className="text-5xl font-black text-green-700">
            {checkedIn}
          </div>

          <div className="mt-2 font-bold uppercase tracking-wide text-green-700">
            Checked In
          </div>

        </div>

        <div className="rounded-2xl bg-red-100 p-6 text-center">

          <div className="text-5xl font-black text-[#e02427]">
            {remaining}
          </div>

          <div className="mt-2 font-bold uppercase tracking-wide text-[#e02427]">
            Remaining
          </div>

        </div>

      </div>

      <div className="mt-8">

        <div className="mb-2 flex justify-between text-sm font-bold text-slate-600">
          <span>Check-In Progress</span>
          <span>{percent}%</span>
        </div>

        <div className="h-4 overflow-hidden rounded-full bg-slate-200">

          <div
            className="h-full rounded-full bg-[#e02427] transition-all duration-500"
            style={{ width: `${percent}%` }}
          />

        </div>

      </div>

    </div>
  );
}