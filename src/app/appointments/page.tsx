import AppointmentsPage from '@/components/AppointmentsPage';

export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Appointments</h1>
        <p className="text-sm text-gray-500">Filter, search, and page through the appointment list.</p>
      </div>
      <AppointmentsPage />
    </div>
  );
}
