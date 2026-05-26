'use client';

import { useCallback, useState } from 'react';
import { bookSlot } from '@/lib/api';
import type { SlotStatus, TimeSlot } from '@/types';

// Tracks per-slot overrides on top of the server data.
// Key: `${staffId}:${time}`, value: the overridden status.
// This lets us do optimistic updates without mutating the original schedule.
type SlotKey = string;
type SlotOverrides = Map<SlotKey, SlotStatus>;

function key(staffId: string, time: string): SlotKey {
  return `${staffId}:${time}`;
}

interface UseSlotBookingResult {
  getSlotStatus: (staffId: string, slot: TimeSlot) => SlotStatus;
  bookingError: string | null;
  onSlotClick: (staffId: string, time: string) => void;
}

export function useSlotBooking(): UseSlotBookingResult {
  const [overrides, setOverrides] = useState<SlotOverrides>(new Map());
  const [bookingError, setBookingError] = useState<string | null>(null);

  const getSlotStatus = useCallback(
    (staffId: string, slot: TimeSlot): SlotStatus => {
      return overrides.get(key(staffId, slot.time)) ?? slot.status;
    },
    [overrides],
  );

  const onSlotClick = useCallback(
    (staffId: string, time: string) => {
      setBookingError(null);

      // Optimistic: mark as pending immediately
      setOverrides(prev => new Map(prev).set(key(staffId, time), 'booked'));

      bookSlot(staffId, time, 'New Patient').then(
        () => {
          // Server confirmed — override stays as booked, nothing more to do
        },
        (err: unknown) => {
          // Revert on failure
          setOverrides(prev => {
            const next = new Map(prev);
            next.delete(key(staffId, time));
            return next;
          });
          setBookingError(
            err instanceof Error ? err.message : 'Booking failed — please try again',
          );
        },
      );
    },
    [],
  );

  return { getSlotStatus, bookingError, onSlotClick };
}
