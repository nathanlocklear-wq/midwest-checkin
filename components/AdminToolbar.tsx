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
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow">
      <div>
        <h2 className="text-xl font-semibold">
          Admin Controls
        </h2>

        <p className="text-sm text-slate-500">
          {checkedIn} / {total} attendees checked in
        </p>
      </div>

      <div className="flex flex-wrap gap-2">

        <button
          onClick={onRefresh}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Refresh
        </button>

        <button
          onClick={onClear}
          className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          Clear Storage
        </button>

      </div>
    </div>
  );
}