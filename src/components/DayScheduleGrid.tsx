'use client';

/**
 * TASK 2 — Build the DayScheduleGrid component
 *
 * Context
 * -------
 * The product team wants a "book appointment" flow. The first step is showing
 * a clinician's availability for the selected day so the receptionist can pick
 * a time slot. Think of it as a cut-down version of the weekly rota overview
 * already in the app, but for a single day with 30-minute time columns.
 *
 * What to build
 * -------------
 * A grid where:
 *   • Each ROW is a staff member (name + role in a fixed-width left column)
 *   • Each COLUMN is a 30-minute slot from 08:00–16:30
 *   • Each CELL is coloured by slot status:
 *       available → green (clickable)
 *       booked    → blue  (shows patient initials, not clickable)
 *       blocked   → red   (not clickable, label "Blocked")
 *       break     → grey  (not clickable, label "Break")
 *
 * Interaction
 * -----------
 * Clicking an available cell should:
 *   1. Immediately show the cell as "pending" (optimistic UI)
 *   2. Call bookSlot(staffId, time, "New Patient") from @/lib/api
 *   3. On success: cell becomes "booked"
 *   4. On failure: cell reverts to "available" and shows an error toast/message
 *
 * Data
 * ----
 * Call fetchDaySchedule(getTodayStr()) from @/lib/api on mount.
 * The response shape is StaffDaySchedule[] — see @/types/index.ts.
 * Show a loading skeleton while fetching.
 * Show an error state with a retry button if the fetch fails.
 *
 * Quality bar
 * -----------
 * The grid should not re-render every cell when one slot's state changes.
 * The component API should be clean — no prop drilling through 3 levels for
 * the booking callback.
 * The time-slot headers should stay visible when scrolling horizontally.
 *
 * You have access to everything in this repo. You can add files, install
 * packages, and restructure as you see fit — treat it like real work.
 */

import { getTodayStr } from '@/lib/mock-data';
import type { StaffDaySchedule } from '@/types';

interface DayScheduleGridProps {
  date?: string;
}

// TODO: implement this component.
// The shell below just shows the date so the page renders without errors.
export default function DayScheduleGrid({ date = getTodayStr() }: DayScheduleGridProps) {
  return (
    <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center space-y-2">
      <p className="text-lg font-semibold text-gray-500">DayScheduleGrid</p>
      <p className="text-sm text-gray-400">Not yet implemented · date: {date}</p>
    </div>
  );
}
