import DayScheduleGrid from '@/components/DayScheduleGrid';

export default function Page() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Book Appointment</h1>
        <p className="text-sm text-gray-500">Select an available slot to book an appointment.</p>
      </div>
      <DayScheduleGrid />
    </div>
  );
}
