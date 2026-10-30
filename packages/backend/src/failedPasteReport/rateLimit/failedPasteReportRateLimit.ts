import { TooManyFailedPasteReportsError } from '../../models/errors/tooManyFailedPasteReportsError'

const REPORTS_PER_WINDOW = 5
const WINDOW_MS = 60 * 60 * 1000
const MS_PER_SECOND = 1000

// In memory, so it resets on restart or deploy. That's acceptable on the single Render instance.
const reportTimesByUserId = new Map<string, number[]>()

// Takes one of the user's slots for the rolling hour and returns a function that gives it back,
// so a report that fails doesn't use up the limit. Reserving before the report is filed keeps
// concurrent requests from all slipping past the limit.
export function reserveFailedPasteReportSlot(userId: string): () => void {
  const now = Date.now()
  const reportTimes = getReportTimesInWindow(userId, now)
  if (reportTimes.length >= REPORTS_PER_WINDOW) {
    const nextSlotOpensAt = reportTimes[0] + WINDOW_MS
    throw new TooManyFailedPasteReportsError(
      REPORTS_PER_WINDOW,
      Math.ceil((nextSlotOpensAt - now) / MS_PER_SECOND),
    )
  }

  reportTimesByUserId.set(userId, [...reportTimes, now])
  return () => releaseSlot(userId, now)
}

export function resetFailedPasteReportRateLimit(): void {
  reportTimesByUserId.clear()
}

function getReportTimesInWindow(userId: string, now: number): number[] {
  return (reportTimesByUserId.get(userId) ?? []).filter(
    (reportTime) => now - reportTime < WINDOW_MS,
  )
}

function releaseSlot(userId: string, reportTime: number): void {
  const reportTimes = reportTimesByUserId.get(userId) ?? []
  const releasedIndex = reportTimes.indexOf(reportTime)
  if (releasedIndex === -1) {
    return
  }
  reportTimesByUserId.set(userId, reportTimes.toSpliced(releasedIndex, 1))
}
