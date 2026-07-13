export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-4xl mx-auto p-10">

        <h1 className="text-5xl font-bold text-center text-blue-900">
          MidwestTechTalk Check-In
        </h1>

        <p className="text-center text-gray-600 mt-4">
          Conference Registration System
        </p>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">

          <label className="block text-lg font-semibold mb-2">
            Search Attendees
          </label>

          <input
            type="text"
            placeholder="Type a name, school, or email..."
            className="w-full border rounded-lg p-4 text-lg"
          />

        </div>

      </div>
    </main>
  );
}