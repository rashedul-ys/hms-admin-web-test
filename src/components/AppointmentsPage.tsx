'use client';

/**
 * TASK 1 — Bug fix
 *
 * This page was working fine until users started filing these reports:
 *
 *   "I filtered by Completed, saw 3 results on page 1. Then I changed to
 *    Scheduled — it jumped straight to page 2 of the scheduled list and
 *    showed nothing, even though there are scheduled appointments."
 *
 *   "Same thing with search. I search for a name, go to page 2, clear
 *    the search — I'm still on page 2 and see fewer rows than expected."
 *
 * Reproduce it:
 *   1. Run the app and go to /appointments
 *   2. Advance to page 2 using the pagination buttons
 *   3. Change the Status or Department filter
 *   4. Notice you stay on page 2 — which is often empty for smaller result sets
 *
 * Fix the bug. Don't change what the filters do — only fix the pagination behaviour.
 */

import { useEffect, useState, useCallback } from 'react';
import { fetchAppointments } from '@/lib/api';
import { DEPARTMENTS } from '@/lib/mock-data';
import type { Appointment, AppointmentFilters, AppointmentStatus } from '@/types';

const STATUS_OPTIONS: { label: string; value: AppointmentStatus | '' }[] = [
  { label: 'All statuses', value: '' },
  { label: 'Scheduled',    value: 'scheduled' },
  { label: 'Confirmed',    value: 'confirmed' },
  { label: 'In progress',  value: 'in_progress' },
  { label: 'Completed',    value: 'completed' },
  { label: 'Cancelled',    value: 'cancelled' },
  { label: 'No show',      value: 'no_show' },
];

const STATUS_STYLES: Record<AppointmentStatus, string> = {
  scheduled:   'bg-yellow-100 text-yellow-800',
  confirmed:   'bg-blue-100   text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed:   'bg-green-100  text-green-800',
  cancelled:   'bg-red-100    text-red-800',
  no_show:     'bg-gray-100   text-gray-700',
};

const PAGE_SIZE = 5;

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [total, setTotal]               = useState(0);
  const [totalPages, setTotalPages]     = useState(1);
  const [isLoading, setIsLoading]       = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // Filter state
  const [status, setStatus]           = useState<AppointmentStatus | ''>('');
  const [departmentId, setDepartmentId] = useState('');
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);

  const load = useCallback(
    async (filters: AppointmentFilters, signal: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchAppointments(filters, signal);
        setAppointments(res.data);
        setTotal(res.pagination.total);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        if ((err as DOMException).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Failed to load appointments');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    load({ status: status || undefined, departmentId: departmentId || undefined, search: search || undefined, page, limit: PAGE_SIZE }, controller.signal);
    return () => controller.abort();
  }, [status, departmentId, search, page, load]);

  // ── BUG: the three handlers below update their own slice of state but never
  // reset `page` back to 1. When the result set shrinks (e.g. filtering from
  // "All" down to "Completed"), the user stays on whatever page they were on,
  // which is often beyond the new totalPages and therefore returns 0 rows.
  const handleStatusChange = (value: AppointmentStatus | '') => {
    setStatus(value);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentId(value);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search patient name…"
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={e => handleStatusChange(e.target.value as AppointmentStatus | '')}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={departmentId}
          onChange={e => handleDepartmentChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              {['Patient', 'Clinician', 'Department', 'Scheduled', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <tr key={i} className="border-t animate-pulse">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-red-600">{error}</td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No appointments found</td>
              </tr>
            ) : (
              appointments.map(appt => (
                <tr key={appt.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{appt.patient.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{appt.staff.fullName}</td>
                  <td className="px-4 py-3 text-gray-600">{appt.department.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(appt.scheduledAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.status]}`}>
                      {appt.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{total} total · page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
