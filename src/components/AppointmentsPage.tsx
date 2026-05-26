'use client';

import { useEffect, useReducer, useCallback, useRef } from 'react';
import { fetchAppointments } from '@/lib/api';
import { DEPARTMENTS } from '@/lib/mock-data';
import type { Appointment, AppointmentFilters, AppointmentStatus, PaginatedResponse } from '@/types';

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

// ─── Filter state ─────────────────────────────────────────────────────────────
// All filters and page live in one object. Any filter change resets page to 1
// structurally — there's no way to forget it because setFilter always does it.
// The production version of this pattern uses URL search params as the source
// of truth (see RotaOverview) so filters survive a page refresh and are shareable.

interface FilterState {
  status: AppointmentStatus | '';
  departmentId: string;
  search: string;
  page: number;
}

type FilterAction =
  | { type: 'SET_FILTER'; payload: Partial<Omit<FilterState, 'page'>> }
  | { type: 'SET_PAGE'; payload: number };

const initialFilters: FilterState = {
  status: '',
  departmentId: '',
  search: '',
  page: 1,
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_FILTER':
      // Any filter change always resets page — one place, impossible to miss
      return { ...state, ...action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface LoadState {
  appointments: Appointment[];
  pagination: PaginatedResponse<Appointment>['pagination'] | null;
  isLoading: boolean;
  error: string | null;
}

export default function AppointmentsPage() {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const [{ appointments, pagination, isLoading, error }, setLoadState] =
    useReducer(
      (_: LoadState, next: LoadState) => next,
      { appointments: [], pagination: null, isLoading: true, error: null },
    );

  // Debounce search so we don't fire a request on every keystroke
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = useCallback((value: string) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      dispatch({ type: 'SET_FILTER', payload: { search: value } });
    }, 300);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setLoadState({ appointments: [], pagination: null, isLoading: true, error: null });

    const apiFilters: AppointmentFilters = {
      status:       filters.status       || undefined,
      departmentId: filters.departmentId || undefined,
      search:       filters.search       || undefined,
      page:         filters.page,
      limit:        PAGE_SIZE,
    };

    fetchAppointments(apiFilters, controller.signal)
      .then(res => {
        setLoadState({
          appointments: res.data,
          pagination:   res.pagination,
          isLoading:    false,
          error:        null,
        });
      })
      .catch(err => {
        if ((err as DOMException).name === 'AbortError') return;
        setLoadState({
          appointments: [],
          pagination:   null,
          isLoading:    false,
          error:        err instanceof Error ? err.message : 'Failed to load appointments',
        });
      });

    return () => controller.abort();
  }, [filters]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search patient name…"
          defaultValue={filters.search}
          onChange={e => handleSearchChange(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filters.status}
          onChange={e => dispatch({ type: 'SET_FILTER', payload: { status: e.target.value as AppointmentStatus | '' } })}
          className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filters.departmentId}
          onChange={e => dispatch({ type: 'SET_FILTER', payload: { departmentId: e.target.value } })}
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
        <span>
          {pagination ? `${pagination.total} total · page ${pagination.page} of ${pagination.totalPages}` : ''}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: filters.page - 1 })}
            disabled={filters.page <= 1 || isLoading}
            className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: filters.page + 1 })}
            disabled={!pagination?.hasNextPage || isLoading}
            className="px-3 py-1.5 border rounded-md disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
