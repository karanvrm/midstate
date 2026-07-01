import { prisma } from "@/lib/prisma";

interface RecordActivityInput {
  candidateId: string;
  staffId: string;
  status: string;
  remarks?: string | null;
}

export interface DateRange {
  from: Date;
  to: Date;
  /** When true, aggregate trend data by calendar month instead of by day */
  groupByMonth?: boolean;
}

/**
 * Compute the retention cutoff: the first day of the calendar month
 * that is exactly (retainMonths - 1) months before the current month.
 *
 * Example with retainMonths=3 and today=July:
 *   cutoff = May 1  →  keep May, Jun, Jul  →  delete April and older
 */
function getRetentionCutoff(retainMonths = 3): Date {
  const now = new Date();
  // Month index of the oldest month to keep (0-based).
  // e.g. July (6) - (3-1) = May (4)
  const cutoffMonth = now.getUTCMonth() - (retainMonths - 1);
  const cutoffYear = now.getUTCFullYear() + Math.floor(cutoffMonth / 12);
  const normalizedMonth = ((cutoffMonth % 12) + 12) % 12;
  return new Date(Date.UTC(cutoffYear, normalizedMonth, 1));
}

/**
 * Record a recruiter interaction when they update a candidate's status and/or remark.
 * After recording, automatically purge records older than the last 3 calendar months.
 */
export async function recordActivity({
  candidateId,
  staffId,
  status,
  remarks,
}: RecordActivityInput) {
  const now = new Date();
  // Strip the time portion to get the calendar date in UTC for tz-independent date counting
  const calendarDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const result = await prisma.recruiterActivity.create({
    data: {
      candidateId,
      staffId,
      status: status.toUpperCase(),
      remarks,
      date: calendarDate,
      timestamp: now,
    },
  });

  // Auto-retention: delete records older than the last 3 calendar months.
  // Runs in background — errors are swallowed to never affect the user.
  const cutoff = getRetentionCutoff(3);
  prisma.recruiterActivity
    .deleteMany({ where: { date: { lt: cutoff } } })
    .catch((err: unknown) => {
      console.error("[analytics] Auto-retention cleanup failed:", err);
    });

  return result;
}

// ---------------------------------------------------------------------------
// Helper: compute a DateRange from a filter string
// ---------------------------------------------------------------------------
export type FilterOption = "today" | "this_week" | "this_month" | "last_3_months";

export function computeDateRange(filter: FilterOption): DateRange {
  const now = new Date();
  // Work in UTC calendar-date arithmetic (matches how `date` column is stored)
  const todayY = now.getUTCFullYear();
  const todayM = now.getUTCMonth();
  const todayD = now.getUTCDate();

  // End of today in UTC (inclusive upper bound)
  const endOfToday = new Date(Date.UTC(todayY, todayM, todayD, 23, 59, 59, 999));

  switch (filter) {
    case "today": {
      const from = new Date(Date.UTC(todayY, todayM, todayD));
      return { from, to: endOfToday };
    }

    case "this_week": {
      // ISO week: Monday = 0 offset. getUTCDay() returns 0=Sun, 1=Mon … 6=Sat
      const dayOfWeek = now.getUTCDay(); // 0=Sun
      // Days since most recent Monday: Sun→6, Mon→0, Tue→1, …
      const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const from = new Date(Date.UTC(todayY, todayM, todayD - daysSinceMonday));
      return { from, to: endOfToday };
    }

    case "this_month": {
      const from = new Date(Date.UTC(todayY, todayM, 1));
      return { from, to: endOfToday };
    }

    case "last_3_months": {
      // Oldest month to show: (currentMonth - 2). Keep 3 calendar months including current.
      const startMonth = todayM - 2;
      const startYear = todayY + Math.floor(startMonth / 12);
      const normalizedMonth = ((startMonth % 12) + 12) % 12;
      const from = new Date(Date.UTC(startYear, normalizedMonth, 1));
      return { from, to: endOfToday, groupByMonth: true };
    }

    default:
      // Fallback to today
      return {
        from: new Date(Date.UTC(todayY, todayM, todayD)),
        to: endOfToday,
      };
  }
}

// ---------------------------------------------------------------------------
// Staff Analytics
// ---------------------------------------------------------------------------

/**
 * Get analytics for a single staff member.
 * When dateRange is provided, all KPIs and trend data are scoped to that range.
 */
export async function getStaffAnalytics(staffId: string, dateRange?: DateRange) {
  const dateFilter = dateRange
    ? { date: { gte: dateRange.from, lte: dateRange.to } }
    : {};

  // 1. My Total Edits (raw database rows)
  const totalEdits = await prisma.recruiterActivity.count({
    where: { staffId, ...dateFilter },
  });

  // 2. My Candidates Touched (unique candidateIds)
  const candidatesTouchedGroup = await prisma.recruiterActivity.groupBy({
    by: ["candidateId"],
    where: { staffId, ...dateFilter },
  });
  const candidatesTouched = candidatesTouchedGroup.length;

  // 3. My Total Activity Count (Counting Rule: unique candidate-date combinations)
  const activityGroup = await prisma.recruiterActivity.groupBy({
    by: ["candidateId", "date"],
    where: { staffId, ...dateFilter },
  });
  const activityCount = activityGroup.length;

  // 4. My Active Days (unique dates)
  const activeDaysGroup = await prisma.recruiterActivity.groupBy({
    by: ["date"],
    where: { staffId, ...dateFilter },
  });
  const activeDays = activeDaysGroup.length;

  // 5. Build trend data
  let trend: TrendPoint[];

  if (dateRange?.groupByMonth) {
    // Last 3 Months — group by calendar month
    trend = await buildMonthlyTrend(staffId, dateRange);
  } else if (dateRange) {
    // Today / This Week / This Month — day-by-day within the range
    trend = await buildDailyTrend(staffId, dateRange.from, dateRange.to);
  } else {
    // Default: last 7 days (original behaviour)
    const now = new Date();
    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - i));
      days.push(d);
    }
    const startDay = days[0];
    trend = await buildDailyTrend(staffId, startDay, new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)));
  }

  return {
    totalEdits,
    candidatesTouched,
    activityCount,
    activeDays,
    trend,
  };
}

interface TrendPoint {
  date: string;
  rawDate: string;
  uniqueCandidates: number;
  interested: number;
  notReachableBusy: number;
  notInterested: number;
  disconnecting: number;
  poorComms: number;
  selected: number;
}

/** Build a day-by-day trend for a staff member within [from, to] */
async function buildDailyTrend(staffId: string, from: Date, to: Date): Promise<TrendPoint[]> {
  // Enumerate every calendar day in the range
  const days: Date[] = [];
  const cursor = new Date(from);
  while (cursor <= to) {
    days.push(new Date(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  const recentActivities = await prisma.recruiterActivity.findMany({
    where: { staffId, date: { gte: from, lte: to } },
    orderBy: { timestamp: "asc" },
  });

  const finalStatusMap = new Map<string, string>(); // `candidateId_dateISO` → status
  for (const act of recentActivities) {
    const key = `${act.candidateId}_${act.date.toISOString()}`;
    finalStatusMap.set(key, act.status.toUpperCase());
  }

  return days.map((d) => {
    const dateISO = d.toISOString();
    const dayStatuses: string[] = [];
    let uniqueCandidates = 0;

    finalStatusMap.forEach((status, key) => {
      if (key.endsWith(`_${dateISO}`)) {
        uniqueCandidates++;
        dayStatuses.push(status);
      }
    });

    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

    return {
      date: label,
      rawDate: dateISO,
      uniqueCandidates,
      interested: dayStatuses.filter((s) => s === "INTERESTED").length,
      notReachableBusy: dayStatuses.filter((s) => s === "NOT_REACHABLE" || s === "BUSY").length,
      notInterested: dayStatuses.filter((s) => s === "NOT_INTERESTED").length,
      disconnecting: dayStatuses.filter((s) => s === "DISCONNECTING").length,
      poorComms: dayStatuses.filter((s) => s === "POOR_COMMS").length,
      selected: dayStatuses.filter((s) => s === "SELECTED").length,
    };
  });
}

/** Build a 3-month aggregated trend for a staff member */
async function buildMonthlyTrend(staffId: string, dateRange: DateRange): Promise<TrendPoint[]> {
  const activities = await prisma.recruiterActivity.findMany({
    where: { staffId, date: { gte: dateRange.from, lte: dateRange.to } },
    orderBy: { timestamp: "asc" },
  });

  // Build finalStatusMap: `candidateId_dateISO` → final status
  const finalStatusMap = new Map<string, string>();
  for (const act of activities) {
    const key = `${act.candidateId}_${act.date.toISOString()}`;
    finalStatusMap.set(key, act.status.toUpperCase());
  }

  // Build month buckets for the 3 months in the range
  const months = getMonthsInRange(dateRange.from, dateRange.to);

  return months.map(({ year, month, label }) => {
    const monthStart = new Date(Date.UTC(year, month, 1));
    const monthEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

    const uniqueKeys = new Set<string>();
    const statuses: string[] = [];

    finalStatusMap.forEach((status, key) => {
      // Extract the date from the key (format: `uuid_ISOstring`)
      const parts = key.split("_");
      const dateStr = parts[parts.length - 1];
      const d = new Date(dateStr);
      if (d >= monthStart && d <= monthEnd) {
        // unique candidate per day within month - already deduplicated by finalStatusMap
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          statuses.push(status);
        }
      }
    });

    const uniqueCandidates = uniqueKeys.size;

    return {
      date: label,
      rawDate: monthStart.toISOString(),
      uniqueCandidates,
      interested: statuses.filter((s) => s === "INTERESTED").length,
      notReachableBusy: statuses.filter((s) => s === "NOT_REACHABLE" || s === "BUSY").length,
      notInterested: statuses.filter((s) => s === "NOT_INTERESTED").length,
      disconnecting: statuses.filter((s) => s === "DISCONNECTING").length,
      poorComms: statuses.filter((s) => s === "POOR_COMMS").length,
      selected: statuses.filter((s) => s === "SELECTED").length,
    };
  });
}

function getMonthsInRange(from: Date, to: Date) {
  const result: { year: number; month: number; label: string }[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
  while (cursor <= to) {
    result.push({
      year: cursor.getUTCFullYear(),
      month: cursor.getUTCMonth(),
      label: cursor.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Owner / Admin Analytics
// ---------------------------------------------------------------------------

/**
 * Get analytics for owner/admin (platform view).
 * When dateRange is provided, all KPIs and breakdown data are scoped to that range.
 */
export async function getOwnerAnalytics(dateRange?: DateRange) {
  const dateFilter = dateRange
    ? { date: { gte: dateRange.from, lte: dateRange.to } }
    : {};

  // 1. Total Edits (raw rows)
  const totalEdits = await prisma.recruiterActivity.count({ where: { ...dateFilter } });

  // 2. Candidates Touched (unique candidateIds)
  const candidatesTouchedGroup = await prisma.recruiterActivity.groupBy({
    by: ["candidateId"],
    where: { ...dateFilter },
  });
  const candidatesTouched = candidatesTouchedGroup.length;

  // 3. Active Recruiters (unique staffIds)
  const activeRecruitersGroup = await prisma.recruiterActivity.groupBy({
    by: ["staffId"],
    where: { ...dateFilter },
  });
  const activeRecruiters = activeRecruitersGroup.length;

  // 4. Total Recruiter Actions (Counting Rule: unique candidate-staff-date combinations)
  const totalActionsGroup = await prisma.recruiterActivity.groupBy({
    by: ["staffId", "candidateId", "date"],
    where: { ...dateFilter },
  });
  const totalActions = totalActionsGroup.length;

  // 5. Staff users list for breakdown (active staff only)
  const staffUsers = await prisma.user.findMany({
    where: { role: "STAFF", status: "ACTIVE" },
    select: { id: true, name: true, email: true, role: true },
  });

  // 6. Fetch all activities in the range for in-memory breakdown calculation
  const allActivities = await prisma.recruiterActivity.findMany({
    where: { ...dateFilter },
    select: {
      staffId: true,
      candidateId: true,
      date: true,
      status: true,
      timestamp: true,
    },
    orderBy: { timestamp: "asc" },
  });

  const finalStatusMap = new Map<string, string>(); // `${staffId}_${candidateId}_${date}` → status
  for (const act of allActivities) {
    const key = `${act.staffId}_${act.candidateId}_${act.date.toISOString()}`;
    finalStatusMap.set(key, act.status.toUpperCase());
  }

  const breakdown = staffUsers.map((user) => {
    let activityCount = 0;
    let interested = 0;
    let notReachableBusy = 0;
    let notInterested = 0;
    let disconnecting = 0;
    let poorComms = 0;
    let selected = 0;

    finalStatusMap.forEach((status, key) => {
      if (key.startsWith(`${user.id}_`)) {
        activityCount++;
        if (status === "INTERESTED") interested++;
        else if (status === "NOT_REACHABLE" || status === "BUSY") notReachableBusy++;
        else if (status === "NOT_INTERESTED") notInterested++;
        else if (status === "DISCONNECTING") disconnecting++;
        else if (status === "POOR_COMMS") poorComms++;
        else if (status === "SELECTED") selected++;
      }
    });

    // Unique candidates touched by this specific staff member
    const userActivities = allActivities.filter((a) => a.staffId === user.id);
    const rawEdits = userActivities.length;
    const uniqueCandidates = new Set(userActivities.map((a) => a.candidateId));
    const staffCandidatesTouched = uniqueCandidates.size;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      activityCount,
      candidatesTouched: staffCandidatesTouched,
      editsCount: rawEdits,
      interested,
      notReachableBusy,
      notInterested,
      disconnecting,
      poorComms,
      selected,
    };
  });

  return {
    totalEdits,
    candidatesTouched,
    activeRecruiters,
    totalActions,
    breakdown,
  };
}
