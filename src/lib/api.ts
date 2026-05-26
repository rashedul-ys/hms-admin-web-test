import { APPOINTMENTS, DAY_SCHEDULE, getTodayStr } from './mock-data';
import type {
  Appointment,
  AppointmentFilters,
  PaginatedResponse,
  StaffDaySchedule,
} from '@/types';

const LATENCY = 500;

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

export async function fetchAppointments(
  filters: AppointmentFilters = {},
  signal?: AbortSignal,
): Promise<PaginatedResponse<Appointment>> {
  await sleep(LATENCY, signal);

  let results = [...APPOINTMENTS];

  if (filters.status) {
    results = results.filter(a => a.status === filters.status);
  }
  if (filters.departmentId) {
    results = results.filter(a => a.department.id === filters.departmentId);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(a => a.patient.fullName.toLowerCase().includes(q));
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 5;
  const total = results.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    data: results.slice(start, start + limit),
    pagination: { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
  };
}

export async function fetchDaySchedule(
  date: string,
  signal?: AbortSignal,
): Promise<StaffDaySchedule[]> {
  await sleep(LATENCY, signal);
  const today = getTodayStr();
  // Return today's data regardless of requested date for demo purposes
  return date === today ? DAY_SCHEDULE : [];
}

export async function bookSlot(
  staffId: string,
  time: string,
  patientName: string,
  signal?: AbortSignal,
): Promise<{ success: boolean }> {
  await sleep(800, signal);
  // Mutate in-memory so the grid reflects the booking
  const schedule = DAY_SCHEDULE.find(s => s.staff.id === staffId);
  const slot = schedule?.slots.find(s => s.time === time);
  if (slot && slot.status === 'available') {
    slot.status = 'booked';
    slot.bookedBy = { id: 'new', fullName: patientName, initials: patientName.slice(0, 2).toUpperCase() };
  }
  return { success: true };
}
