import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Technical Interview</h1>
        <p className="text-gray-500 mt-1 text-sm">Hospital Management System — two tasks, one hour.</p>
      </div>

      <div className="space-y-3">
        <Link
          href="/appointments"
          className="block border rounded-xl p-5 bg-white hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Task 1 · Bug Fix</p>
              <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">Appointments List</h2>
              <p className="text-sm text-gray-500 mt-1">
                A working feature with a reported bug. Reproduce it, fix it, explain it.
              </p>
            </div>
            <span className="text-gray-300 text-xl">→</span>
          </div>
        </Link>

        <Link
          href="/booking"
          className="block border rounded-xl p-5 bg-white hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Task 2 · Feature Build</p>
              <h2 className="font-semibold text-gray-900 group-hover:text-blue-600">Day Schedule Grid</h2>
              <p className="text-sm text-gray-500 mt-1">
                Build a staff availability grid for the appointment booking flow.
              </p>
            </div>
            <span className="text-gray-300 text-xl">→</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
