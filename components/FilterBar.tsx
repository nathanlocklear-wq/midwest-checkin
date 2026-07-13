type Filter =
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

const filters: Filter[] = [
  "ALL",
  "NEEDS_SHIRT",
  "SPECIAL",
  "STANDARD",
  "LATE",
  "NONE",
  "CHECKED_IN",
];

export default function FilterBar({
  filter,
  setFilter,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            filter === f
              ? "bg-blue-700 text-white"
              : "bg-gray-200"
          }`}
        >
          {f.replaceAll("_", " ")}
        </button>
      ))}
    </div>
  );
}