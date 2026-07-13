interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name, email, company, or ticket..."
      className="mb-6 w-full rounded-xl border border-gray-300 bg-white p-4 text-lg shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
    />
  );
}