'use client';

import { useCallback, useEffect, useReducer, memo } from 'react';
import { fetchDaySchedule } from '@/lib/api';
import { getTodayStr } from '@/lib/mock-data';
import { useSlotBooking } from '@/hooks/use-slot-booking';
import type { StaffDaySchedule, TimeSlot, SlotStatus } from '@/types';

// ─── Constants ────────────────────────────────────────────────────────────────

// Generate all 30-min slots from 08:00 to 16:30
const TIME_SLOTS: string[] = Array.from({ length: 18 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 30;
  const h = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const m = String(totalMinutes % 60).padStart(2, '0');
  return `${h}:${m}`;
});

const STATUS_CONFIG: Record<SlotStatus, { label: string; bg: string; text: string; clickable: boolean }> = {
  available: { label: 'Free',    bg: 'bg-green-100 hover:bg-green-200', text: 'text-green-700', clickable: true  },
  booked:    { label: '',        bg: 'bg-blue-100',                     text: 'text-blue-700',  clickable: false },
  blocked:   { label: 'Blocked', bg: 'bg-red-50',                       text: 'text-red-400',   clickable: false },
  break:     { label: 'Break',   bg: 'bg-gray-100',                     text: 'text-gray-400',  clickable: false },
};

// ─── Load state ───────────────────────────────────────────────────────────────

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; schedules: StaffDaySchedule[] };

// ─── SlotCell — isolated so only the clicked cell re-renders ─────────────────

interface SlotCellProps {
  staffId: string;
  slot: TimeSlot;
  displayStatus: SlotStatus;
  onBook: (staffId: string, time: string) => void;
}

const SlotCell = memo(function SlotCell({ staffId, slot, displayStatus, onBook }: SlotCellProps) {
  const config = STATUS_CONFIG[displayStatus];

  const handleClick = () => {
    if (config.clickable) onBook(staffId, slot.time);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (config.clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onBook(staffId, slot.time);
    }
  };

  return (
    <div
      role={config.clickable ? 'button' : undefined}
      tabIndex={config.clickable ? 0 : undefined}
      aria-label={config.clickable ? `Book ${slot.time}` : `${slot.time} ${displayStatus}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        h-12 flex items-center justify-center text-xs font-medium border-r last:border-r-0
        transition-colors select-none
        ${config.bg} ${config.text}
        ${config.clickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400' : 'cursor-default'}
      `}
    >
      {displayStatus === 'booked' && slot.bookedBy ? (
        <span
          title={slot.bookedBy.fullName}
          className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-xs font-semibold"
        >
          {slot.bookedBy.initials}
        </span>
      ) : (
        <span>{config.label}</span>
      )}
    </div>
  );
});

// ─── ScheduleRow — one staff member ──────────────────────────────────────────

interface ScheduleRowProps {
  schedule: StaffDaySchedule;
  getSlotStatus: (staffId: string, slot: TimeSlot) => SlotStatus;
  onBook: (staffId: string, time: string) => void;
}

const ScheduleRow = memo(function ScheduleRow({ schedule, getSlotStatus, onBook }: ScheduleRowProps) {
  const slotMap = new Map(schedule.slots.map(s => [s.time, s]));

  return (
    <div className="grid border-b" style={{ gridTemplateColumns: `180px repeat(${TIME_SLOTS.length}, 1fr)` }}>
      {/* Staff name column */}
      <div className="px-3 py-2 border-r flex flex-col justify-center bg-white sticky left-0 z-10">
        <span className="text-sm font-medium text-gray-900 truncate">{schedule.staff.fullName}</span>
        <span className="text-xs text-gray-500 capitalize">{schedule.staff.role}</span>
      </div>

      {/* Slot columns */}
      {TIME_SLOTS.map(time => {
        const slot = slotMap.get(time) ?? { time, status: 'blocked' as SlotStatus };
        const displayStatus = getSlotStatus(schedule.staff.id, slot);
        return (
          <SlotCell
            key={time}
            staffId={schedule.staff.id}
            slot={slot}
            displayStatus={displayStatus}
            onBook={onBook}
          />
        );
      })}
    </div>
  );
});

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <div className="animate-pulse space-y-0 border rounded-xl overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="grid border-b"
          style={{ gridTemplateColumns: `180px repeat(${TIME_SLOTS.length}, 1fr)` }}
        >
          <div className="px-3 py-4 border-r space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
          {TIME_SLOTS.map(t => (
            <div key={t} className="h-12 border-r last:border-r-0 bg-gray-100" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DayScheduleGridProps {
  date?: string;
}

export default function DayScheduleGrid({ date = getTodayStr() }: DayScheduleGridProps) {
  const [loadState, setLoadState] = useReducer(
    (_: LoadState, next: LoadState) => next,
    { status: 'loading' },
  );

  const { getSlotStatus, bookingError, onSlotClick } = useSlotBooking();

  const load = useCallback(
    (signal: AbortSignal) => {
      setLoadState({ status: 'loading' });
      fetchDaySchedule(date, signal)
        .then(schedules => setLoadState({ status: 'success', schedules }))
        .catch(err => {
          if ((err as DOMException).name === 'AbortError') return;
          setLoadState({ status: 'error', message: err instanceof Error ? err.message : 'Failed to load schedule' });
        });
    },
    [date],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  if (loadState.status === 'loading') return <GridSkeleton />;

  if (loadState.status === 'error') {
    return (
      <div className="border rounded-xl p-10 text-center space-y-3">
        <p className="text-red-600 text-sm">{loadState.message}</p>
        <button
          onClick={() => { const c = new AbortController(); load(c.signal); }}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
        >
          Retry
        </button>
      </div>
    );
  }

  const { schedules } = loadState;

  if (schedules.length === 0) {
    return (
      <div className="border rounded-xl p-10 text-center text-gray-400 text-sm">
        No staff available for {date}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookingError && (
        <div className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {bookingError}
        </div>
      )}

      <div className="border rounded-xl overflow-hidden">
        {/* Sticky time-slot header */}
        <div
          className="grid border-b bg-gray-50 sticky top-0 z-20"
          style={{ gridTemplateColumns: `180px repeat(${TIME_SLOTS.length}, 1fr)` }}
        >
          <div className="px-3 py-2 border-r text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Clinician
          </div>
          {TIME_SLOTS.map(t => (
            <div key={t} className="py-2 border-r last:border-r-0 text-center text-xs font-medium text-gray-500">
              {t}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="overflow-x-auto">
          {schedules.map(schedule => (
            <ScheduleRow
              key={schedule.staff.id}
              schedule={schedule}
              getSlotStatus={getSlotStatus}
              onBook={onSlotClick}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        {(Object.entries(STATUS_CONFIG) as [SlotStatus, typeof STATUS_CONFIG[SlotStatus]][]).map(
          ([status, cfg]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${cfg.bg.split(' ')[0]}`} />
              <span className="capitalize">{status === 'available' ? 'Available (click to book)' : status}</span>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
