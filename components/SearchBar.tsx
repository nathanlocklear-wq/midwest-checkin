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
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by name, email, company, or ticket..."
      className="w-full rounded-xl border border-gray-300 p-4 text-lg mb-6 bg-white"
    />
  );
}