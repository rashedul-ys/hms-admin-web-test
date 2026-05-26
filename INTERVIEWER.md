# Interviewer Guide

This file is for you — don't share it with the candidate.

---

## Task 1 · Bug Fix

### The bug

In `AppointmentsPage.tsx`, the three filter handlers (`handleStatusChange`, `handleDepartmentChange`, `handleSearchChange`) each update their own state but none of them resets `page` to 1. When the result set shrinks after a filter change, the user stays on their current page, which may now be beyond `totalPages`.

**Reproduce it:**
1. Go to `/appointments`
2. Click **Next** to advance to page 2 (there are 15 appointments, 5 per page)
3. Change the Status filter to **Completed** (only 2 results — 1 page)
4. The table shows "No appointments found" because you're on page 2 of a 1-page result set

### The fix

The minimal correct fix is to reset `page` inside each filter handler:

```tsx
const handleStatusChange = (value: AppointmentStatus | '') => {
  setStatus(value);
  setPage(1); // add this
};
// same for the other two handlers
```

### What distinguishes seniority levels

| Level | What you'll see |
|---|---|
| **Junior** | Adds `setPage(1)` to each handler without further thought. May miss one of the three. |
| **Mid** | Fixes all three, probably mentions a `useEffect` approach as an alternative. |
| **Senior** | Fixes it, then explains *why* the three-handler approach is fragile (easy to miss future handlers). Proposes collapsing filters into a single object `{ status, departmentId, search }` so there's one `setFilters` that always resets page. May mention URL search params as the right long-term solution (matches your actual codebase pattern). |
| **Lead** | All of the above + proactively asks "should filters survive a page refresh?" and "what's the source of truth — component state or the URL?" |

### Good follow-up questions

- *"If a fourth filter was added next month, how would you make sure this bug can't happen again?"*
- *"The useEffect fires on every keystroke in the search field — is that a problem? How would you address it?"* (debouncing)
- *"How would you test this?"*

---

## Task 2 · Day Schedule Grid

### What a complete solution looks like

- Grid renders: staff rows × time columns (08:00–16:30, 18 slots)
- Colour coding: green/blue/red/grey per status
- Fetch on mount with loading skeleton and error+retry state
- Clicking available slot: optimistic update → calls `bookSlot()` → success or revert
- Horizontal scroll with sticky time header row
- No full-grid re-render on single slot click (memo / granular state)

### What distinguishes seniority levels

| Level | What you'll see |
|---|---|
| **Junior** | Gets the grid rendering with colours. May forget loading/error states. Booking probably works but re-renders everything. Types may be loose (`any`). |
| **Mid** | Complete feature, proper loading/error/retry. Booking works. May not think about the re-render problem until asked. |
| **Senior** | All of the above + granular slot state (slot-level, not full array) so only the clicked cell re-renders. Clean component API. Asks clarifying questions about edge cases (what if a booked slot spans 2 slots? what happens on booking failure mid-request?). |
| **Lead** | Thinks about the data model first. Points out that the mock API mutates in-memory and explains what a real implementation would need (invalidate query cache, websocket push for concurrent users). May propose a `useSlotBooking` hook to encapsulate the optimistic-update logic. |

### Good follow-up questions

- *"Two receptionists are looking at this grid at the same time. How would you handle a race condition where both try to book the same slot?"*
- *"The grid has 4 staff × 18 slots = 72 cells. At what point would you worry about render performance here?"*
- *"How would you make this accessible for keyboard-only users?"*
- *"Walk me through how you'd add a 'multi-slot booking' feature — e.g. a 90-minute appointment that spans 3 consecutive slots."*

---

## General signals

**Asks good questions before coding** — understands the domain, not just the syntax.

**Makes explicit trade-offs** — "I'm doing X now because Y; the proper solution would be Z but that's out of scope."

**Talks while working** — narrates decisions, flags uncertainties, doesn't go silent for 10 minutes.

**Uses AI well** — prompts it for boilerplate, reviews what it gives back, catches mistakes in generated code. A red flag is accepting LLM output wholesale without reading it.
