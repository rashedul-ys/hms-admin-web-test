# HMS Admin — Technical Interview

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3100](http://localhost:3100).

---

## Task 1 · Bug Fix (~20 min)

Go to **[/appointments](http://localhost:3100/appointments)**.

Users have filed these support reports:

> *"I filtered by Completed and saw results. Then switched to Scheduled — it jumped to page 2 and showed nothing, even though there are scheduled appointments."*

> *"Same with search — I go to page 2, clear the search, and I'm still on page 2 with fewer rows than I'd expect."*

**Your job:**

1. Reproduce the bug (it takes about 30 seconds once you know what to look for)
2. Find the root cause in `src/components/AppointmentsPage.tsx`
3. Fix it — don't change what the filters do, only fix the pagination behaviour
4. Explain the fix as if you were writing a PR description

---

## Task 2 · Feature Build (~35 min)

Go to **[/booking](http://localhost:3100/booking)**.

The booking flow needs a day schedule grid so receptionists can pick an available slot. The component shell is at `src/components/DayScheduleGrid.tsx` — the full spec is in the file header comment.

**Your job:**

Build the component. Treat it like real work — you can add files, install packages, and structure it however you think is best.

The mock API is in `src/lib/api.ts`. The data shapes are in `src/types/index.ts`.

---

## Notes

- You can use any tools you normally would, including AI assistance.
- Ask questions if anything is unclear — that's normal.
- There's no single right answer for Task 2; the choices you make and your reasoning matter.
