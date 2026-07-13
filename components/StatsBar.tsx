interface Props {
  total: number;
  checkedIn: number;
}

export default function StatsBar({
  total,
  checkedIn,
}: Props) {
  const remaining = total - checkedIn;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">

      <div className="bg-white rounded-xl shadow p-5 text-center">
        <div className="text-4xl font-bold text-blue-700">
          {total}
        </div>

        <div className="text-gray-500">
          Registered
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 text-center">
        <div className="text-4xl font-bold text-green-600">
          {checkedIn}
        </div>

        <div className="text-gray-500">
          Checked In
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-5 text-center">
        <div className="text-4xl font-bold text-orange-600">
          {remaining}
        </div>

        <div className="text-gray-500">
          Remaining
        </div>
      </div>

    </div>
  );
}