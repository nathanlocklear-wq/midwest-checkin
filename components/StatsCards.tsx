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
    <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-7">

      <Card
        title="👥 Total"
        value={total}
        bg="bg-white"
        valueColor="text-[#02112f]"
      />

      <Card
        title="✅ Checked In"
        value={checkedIn}
        bg="bg-green-50"
        valueColor="text-green-700"
      />

      <Card
        title="⏳ Remaining"
        value={remaining}
        bg="bg-amber-50"
        valueColor="text-amber-700"
      />

      <Card
        title="⭐ Special"
        value={special}
        bg="bg-red-50"
        valueColor="text-[#e02427]"
      />

      <Card
        title="👕 Standard"
        value={standard}
        bg="bg-blue-50"
        valueColor="text-[#02112f]"
      />

      <Card
        title="🕒 Late"
        value={late}
        bg="bg-yellow-50"
        valueColor="text-yellow-700"
      />

      <Card
        title="🚫 No Shirt"
        value={none}
        bg="bg-slate-100"
        valueColor="text-slate-700"
      />

    </div>
  );
}

interface CardProps {
  title: string;
  value: number;
  bg: string;
  valueColor: string;
}

function Card({
  title,
  value,
  bg,
  valueColor,
}: CardProps) {
  return (
    <div
      className={`${bg} rounded-3xl border border-slate-200 p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl`}
    >
      <div className="text-sm font-bold uppercase tracking-wider text-slate-500">
        {title}
      </div>

      <div className={`mt-3 text-5xl font-black ${valueColor}`}>
        {value}
      </div>
    </div>
  );
}