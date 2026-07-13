export type Filter =
  | "ALL"
  | "NEEDS_SHIRT"
  | "SPECIAL"
  | "STANDARD"
  | "LATE"
  | "NONE"
  | "CHECKED_IN";

interface Props {
  filter: Filter;
  setFilter: (filter: Filter) => void;
}

const filters: { value: Filter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NEEDS_SHIRT", label: "Needs Shirt" },
  { value: "SPECIAL", label: "Special" },
  { value: "STANDARD", label: "Standard" },
  { value: "LATE", label: "Late" },
  { value: "NONE", label: "None" },
  { value: "CHECKED_IN", label: "Checked In" },
];

export default function FilterBar({
  filter,
  setFilter,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setFilter(value)}
          className={`rounded-lg px-4 py-2 font-semibold transition ${
            filter === value
              ? "bg-blue-700 text-white shadow"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}