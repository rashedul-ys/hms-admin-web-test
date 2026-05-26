export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Patient {
  id: string;
  fullName: string;
  initials: string;
}

export interface Staff {
  id: string;
  fullName: string;
  role: 'doctor' | 'nurse';
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Appointment {
  id: string;
  patient: Patient;
  staff: Staff;
  department: Department;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AppointmentFilters {
  status?: AppointmentStatus | '';
  departmentId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// ─── Task 2 types ─────────────────────────────────────────────────────────────

export type SlotStatus = 'available' | 'booked' | 'blocked' | 'break';

export interface TimeSlot {
  time: string; // "09:00"
  status: SlotStatus;
  bookedBy?: Patient;
}

export interface StaffDaySchedule {
  staff: Staff;
  date: string;
  slots: TimeSlot[];
}
