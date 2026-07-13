interface Props {
  total: number;
  checkedIn: number;
  special: number;
  standard: number;
  late: number;
  none: number;
}

export default function StatsCards({
  total,
  checkedIn,
  special,
  standard,
  late,
  none,
}: Props) {
  const remaining = total - checkedIn;

  return (
    <div className="mb-6 grid gap-4 md:grid-cols-4 xl:grid-cols-7">
      <Card title="Total" value={total} color="text-slate-900" />

      <Card
        title="Checked In"
        value={checkedIn}
        color="text-green-700"
      />

      <Card
        title="Remaining"
        value={remaining}
        color="text-amber-600"
      />

      <Card
        title="🟣 Special"
        value={special}
        color="text-purple-700"
      />

      <Card
        title="🟢 Standard"
        value={standard}
        color="text-green-700"
      />

      <Card
        title="🟠 Late"
        value={late}
        color="text-orange-600"
      />

      <Card
        title="⚫ No Shirt"
        value={none}
        color="text-gray-700"
      />
    </div>
  );
}

interface CardProps {
  title: string;
  value: number;
  color: string;
}

function Card({
  title,
  value,
  color,
}: CardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="text-sm text-slate-500">
        {title}
      </div>

      <div className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </div>
    </div>
  );
}