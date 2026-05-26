import type { Appointment, Staff, Department, StaffDaySchedule } from '@/types';

export const DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Cardiology' },
  { id: 'd2', name: 'Orthopaedics' },
  { id: 'd3', name: 'General Practice' },
  { id: 'd4', name: 'Neurology' },
];

export const STAFF: Staff[] = [
  { id: 's1', fullName: 'Dr. Sarah Al-Farsi',   role: 'doctor', departmentId: 'd1' },
  { id: 's2', fullName: 'Dr. Omar Khalil',       role: 'doctor', departmentId: 'd2' },
  { id: 's3', fullName: 'Dr. Layla Hassan',      role: 'doctor', departmentId: 'd4' },
  { id: 's4', fullName: 'Nurse Fatima Nour',     role: 'nurse',  departmentId: 'd3' },
];

function iso(daysFromNow: number, hour: number, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

export const APPOINTMENTS: Appointment[] = [
  { id: 'a01', scheduledAt: iso(0, 9, 0),   durationMinutes: 30,  status: 'confirmed',   department: DEPARTMENTS[0], staff: STAFF[0], patient: { id: 'p01', fullName: 'James Okafor',      initials: initials('James Okafor') } },
  { id: 'a02', scheduledAt: iso(0, 9, 30),  durationMinutes: 30,  status: 'scheduled',   department: DEPARTMENTS[0], staff: STAFF[0], patient: { id: 'p02', fullName: 'Amira Benali',       initials: initials('Amira Benali') } },
  { id: 'a03', scheduledAt: iso(0, 10, 0),  durationMinutes: 45,  status: 'in_progress', department: DEPARTMENTS[1], staff: STAFF[1], patient: { id: 'p03', fullName: 'Thomas Müller',      initials: initials('Thomas Müller') } },
  { id: 'a04', scheduledAt: iso(0, 10, 30), durationMinutes: 30,  status: 'scheduled',   department: DEPARTMENTS[1], staff: STAFF[1], patient: { id: 'p04', fullName: 'Sofia Petrov',       initials: initials('Sofia Petrov') } },
  { id: 'a05', scheduledAt: iso(0, 11, 0),  durationMinutes: 60,  status: 'scheduled',   department: DEPARTMENTS[3], staff: STAFF[2], patient: { id: 'p05', fullName: 'Kwame Asante',       initials: initials('Kwame Asante') }, notes: 'MRI review' },
  { id: 'a06', scheduledAt: iso(0, 14, 0),  durationMinutes: 30,  status: 'confirmed',   department: DEPARTMENTS[3], staff: STAFF[2], patient: { id: 'p06', fullName: 'Lily Chen',          initials: initials('Lily Chen') } },
  { id: 'a07', scheduledAt: iso(0, 14, 30), durationMinutes: 20,  status: 'scheduled',   department: DEPARTMENTS[2], staff: STAFF[3], patient: { id: 'p07', fullName: 'Ibrahim Al-Rashid',  initials: initials('Ibrahim Al-Rashid') } },
  { id: 'a08', scheduledAt: iso(0, 15, 0),  durationMinutes: 30,  status: 'scheduled',   department: DEPARTMENTS[2], staff: STAFF[3], patient: { id: 'p08', fullName: 'Priya Sharma',       initials: initials('Priya Sharma') } },
  { id: 'a09', scheduledAt: iso(-1, 9, 0),  durationMinutes: 30,  status: 'completed',   department: DEPARTMENTS[0], staff: STAFF[0], patient: { id: 'p09', fullName: 'Carlos Mendez',      initials: initials('Carlos Mendez') } },
  { id: 'a10', scheduledAt: iso(-1, 10, 0), durationMinutes: 45,  status: 'completed',   department: DEPARTMENTS[1], staff: STAFF[1], patient: { id: 'p10', fullName: 'Yuki Tanaka',        initials: initials('Yuki Tanaka') } },
  { id: 'a11', scheduledAt: iso(-1, 11, 0), durationMinutes: 30,  status: 'no_show',     department: DEPARTMENTS[0], staff: STAFF[0], patient: { id: 'p11', fullName: 'Grace Obi',          initials: initials('Grace Obi') } },
  { id: 'a12', scheduledAt: iso(-1, 14, 0), durationMinutes: 30,  status: 'cancelled',   department: DEPARTMENTS[3], staff: STAFF[2], patient: { id: 'p12', fullName: 'Rania Said',         initials: initials('Rania Said') } },
  { id: 'a13', scheduledAt: iso(1, 9, 0),   durationMinutes: 30,  status: 'scheduled',   department: DEPARTMENTS[0], staff: STAFF[0], patient: { id: 'p13', fullName: 'Michael Adeyemi',    initials: initials('Michael Adeyemi') } },
  { id: 'a14', scheduledAt: iso(1, 10, 30), durationMinutes: 45,  status: 'scheduled',   department: DEPARTMENTS[2], staff: STAFF[3], patient: { id: 'p14', fullName: 'Nadia Bergström',    initials: initials('Nadia Bergström') } },
  { id: 'a15', scheduledAt: iso(1, 14, 0),  durationMinutes: 30,  status: 'confirmed',   department: DEPARTMENTS[1], staff: STAFF[1], patient: { id: 'p15', fullName: 'Ahmed Suleiman',     initials: initials('Ahmed Suleiman') } },
];

// ─── Task 2 seed data ─────────────────────────────────────────────────────────

export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export const DAY_SCHEDULE: StaffDaySchedule[] = [
  {
    staff: STAFF[0],
    date: getTodayStr(),
    slots: [
      { time: '08:00', status: 'available' },
      { time: '08:30', status: 'available' },
      { time: '09:00', status: 'booked',    bookedBy: APPOINTMENTS[0].patient },
      { time: '09:30', status: 'booked',    bookedBy: APPOINTMENTS[1].patient },
      { time: '10:00', status: 'available' },
      { time: '10:30', status: 'break' },
      { time: '11:00', status: 'available' },
      { time: '11:30', status: 'available' },
      { time: '12:00', status: 'blocked' },
      { time: '12:30', status: 'blocked' },
      { time: '13:00', status: 'break' },
      { time: '13:30', status: 'break' },
      { time: '14:00', status: 'available' },
      { time: '14:30', status: 'available' },
      { time: '15:00', status: 'available' },
      { time: '15:30', status: 'available' },
      { time: '16:00', status: 'available' },
      { time: '16:30', status: 'available' },
    ],
  },
  {
    staff: STAFF[1],
    date: getTodayStr(),
    slots: [
      { time: '08:00', status: 'blocked' },
      { time: '08:30', status: 'blocked' },
      { time: '09:00', status: 'available' },
      { time: '09:30', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '10:30', status: 'booked',    bookedBy: APPOINTMENTS[2].patient },
      { time: '11:00', status: 'available' },
      { time: '11:30', status: 'available' },
      { time: '12:00', status: 'available' },
      { time: '12:30', status: 'break' },
      { time: '13:00', status: 'break' },
      { time: '13:30', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '14:30', status: 'available' },
      { time: '15:00', status: 'booked',    bookedBy: APPOINTMENTS[4].patient },
      { time: '15:30', status: 'available' },
      { time: '16:00', status: 'available' },
      { time: '16:30', status: 'available' },
    ],
  },
  {
    staff: STAFF[2],
    date: getTodayStr(),
    slots: [
      { time: '08:00', status: 'available' },
      { time: '08:30', status: 'available' },
      { time: '09:00', status: 'available' },
      { time: '09:30', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '10:30', status: 'available' },
      { time: '11:00', status: 'booked',    bookedBy: APPOINTMENTS[4].patient },
      { time: '11:30', status: 'booked',    bookedBy: APPOINTMENTS[4].patient },
      { time: '12:00', status: 'break' },
      { time: '12:30', status: 'break' },
      { time: '13:00', status: 'available' },
      { time: '13:30', status: 'available' },
      { time: '14:00', status: 'booked',    bookedBy: APPOINTMENTS[5].patient },
      { time: '14:30', status: 'available' },
      { time: '15:00', status: 'available' },
      { time: '15:30', status: 'blocked' },
      { time: '16:00', status: 'blocked' },
      { time: '16:30', status: 'available' },
    ],
  },
  {
    staff: STAFF[3],
    date: getTodayStr(),
    slots: [
      { time: '08:00', status: 'available' },
      { time: '08:30', status: 'available' },
      { time: '09:00', status: 'available' },
      { time: '09:30', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '10:30', status: 'available' },
      { time: '11:00', status: 'available' },
      { time: '11:30', status: 'available' },
      { time: '12:00', status: 'break' },
      { time: '12:30', status: 'break' },
      { time: '13:00', status: 'available' },
      { time: '13:30', status: 'available' },
      { time: '14:00', status: 'booked',    bookedBy: APPOINTMENTS[6].patient },
      { time: '14:30', status: 'booked',    bookedBy: APPOINTMENTS[7].patient },
      { time: '15:00', status: 'available' },
      { time: '15:30', status: 'available' },
      { time: '16:00', status: 'available' },
      { time: '16:30', status: 'available' },
    ],
  },
];
