"use client";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/utils";
import { AlertTriangleIcon, ArrowLeftIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface RecordData {
  id: string;
  sheetId: string;
  userId: string;
  day: number;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface AttendanceSheetClientProps {
  sheet: any;
  records: RecordData[];
  loadError?: string;
}

const STATUS_COLORS: Record<string, string> = {
  P: "text-green-400 bg-green-500/15 border border-green-500/20",
  A: "text-red-400 bg-red-500/15 border border-red-500/20",
  HD: "text-orange-400 bg-orange-400/15 border border-orange-400/20",
  H: "text-blue-400 bg-blue-400/15 border border-blue-400/20",
  "-": "text-neutral-500 bg-white/[0.03] border border-white/5",
};

const SUMMARY_COLS = [
  {
    key: "P",
    label: "P",
    title: "Present",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    headerBg: "bg-green-500/5",
  },
  {
    key: "A",
    label: "L/A",
    title: "Absent / Leave",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    headerBg: "bg-red-500/5",
  },
  {
    key: "HD",
    label: "HD",
    title: "Half Day",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    headerBg: "bg-orange-400/5",
  },
  {
    key: "H",
    label: "H",
    title: "Holiday",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    headerBg: "bg-blue-400/5",
  },
];

export default function AttendanceSheetClient({
  sheet,
  records,
  loadError,
}: AttendanceSheetClientProps) {
  const [localRecords, setLocalRecords] = useState<RecordData[]>(records || []);
  const [updatingRecordId, setUpdatingRecordId] = useState<string | null>(null);

  const daysCount = useMemo(() => {
    if (!records || records.length === 0) return 31;
    return Math.max(...records.map((r) => r.day));
  }, [records]);

  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  const usersMap = useMemo(() => {
    const map = new Map<string, { user: RecordData["user"]; records: RecordData[] }>();
    if (!localRecords) return map;

    localRecords.forEach((record) => {
      if (!map.has(record.userId)) {
        map.set(record.userId, { user: record.user, records: [] });
      }
      map.get(record.userId)?.records.push(record);
    });

    map.forEach((data) => {
      data.records.sort((a, b) => a.day - b.day);
    });

    return map;
  }, [localRecords]);

  const handleStatusChange = async (recordId: string, newStatus: string) => {
    const previousRecords = [...localRecords];

    setLocalRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: newStatus } : r))
    );
    setUpdatingRecordId(recordId);

    try {
      const response = await fetch(`/api/attendance-sheets/${sheet?.id}/records`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recordId, status: newStatus }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update record.");
      }
    } catch (error: any) {
      toast.error(error.message);
      setLocalRecords(previousRecords);
    } finally {
      setUpdatingRecordId(null);
    }
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-300/10">
            <AlertTriangleIcon className="size-4" />
          </div>
          <div className="space-y-1">
            <h2 className="font-medium text-amber-50">Database connection unavailable</h2>
            <p className="leading-6 text-amber-100/80">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    /*
     * Outer wrapper: constrained to viewport/container width at all times.
     * The header card is inside this and will never stretch with the table.
     */
    <div className="w-full min-w-0 space-y-6">
      {/* ── Header card ─────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link
              href="/dashboard/owner/attendance"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon className="size-4" />
              Back to Sheets
            </Link>
            <div className="space-y-1">
              <h1 className="font-heading text-lg font-medium tracking-tight text-foreground md:text-xl">
                {sheet?.name}
              </h1>
              <p className="max-w-2xl text-xs leading-5 text-muted-foreground">
                Manage daily attendance for all active staff members.
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="w-fit border-violet-400/30 bg-violet-400/10 px-3 py-1 uppercase tracking-widest text-violet-200"
          >
            Attendance Grid
          </Badge>
        </div>
      </div>

      {/* ── Attendance table ────────────────────────────────────────────────── */}
      {/*
       * The outer div clips the horizontal scroll so it never escapes
       * the page container. The inner wrapper scrolls horizontally.
       * The table itself is min-w-max so it expands to fit all columns.
       */}
      <div className="relative rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl overflow-hidden">
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            {/* ── Column-width hints ──────────────────────────────────────── */}
            <colgroup>
              <col style={{ minWidth: "180px", width: "180px" }} />
              <col style={{ minWidth: "220px", width: "220px" }} />
              {daysArray.map((d) => (
                <col key={d} style={{ minWidth: "60px", width: "60px" }} />
              ))}
              {SUMMARY_COLS.map((s) => (
                <col key={s.key} style={{ minWidth: "60px", width: "60px" }} />
              ))}
            </colgroup>

            {/* ── Head ──────────────────────────────────────────────────── */}
            <thead>
              <tr>
                {/* Name — sticky col 1 */}
                <th
                  className="sticky left-0 top-0 z-30 border-b border-r border-white/8 bg-neutral-900 px-4 py-3 font-medium text-muted-foreground"
                  style={{ boxShadow: "2px 0 4px rgba(0,0,0,0.4)" }}
                >
                  Employee Name
                </th>
                {/* Email — sticky col 2 */}
                <th
                  className="sticky top-0 z-30 border-b border-r border-white/8 bg-neutral-900 px-4 py-3 font-medium text-muted-foreground"
                  style={{ left: "180px", boxShadow: "2px 0 4px rgba(0,0,0,0.4)" }}
                >
                  Email
                </th>

                {/* Day columns */}
                {daysArray.map((day) => (
                  <th
                    key={day}
                    className="sticky top-0 z-20 border-b border-r border-white/8 bg-neutral-900 px-1 py-3 text-center font-medium text-muted-foreground"
                  >
                    {day}
                  </th>
                ))}

                {/* Summary header cells */}
                {SUMMARY_COLS.map((s) => (
                  <th
                    key={s.key}
                    title={s.title}
                    className={cn(
                      "sticky top-0 z-20 border-b border-l border-white/10 px-1 py-3 text-center text-xs font-semibold tracking-wider",
                      s.color,
                      s.headerBg
                    )}
                  >
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ── Body ──────────────────────────────────────────────────── */}
            <tbody>
              {Array.from(usersMap.values()).map(({ user, records: userRecords }) => {
                /* Real-time summary counts */
                const counts: Record<string, number> = { P: 0, A: 0, HD: 0, H: 0 };
                userRecords.forEach((r) => {
                  if (r.status in counts) counts[r.status]++;
                });

                return (
                  <tr key={user.id} className="group hover:bg-white/[0.015]">
                    {/* Name — sticky, fully opaque */}
                    <td
                      className="sticky left-0 z-10 border-b border-r border-white/8 bg-neutral-950 px-4 py-2.5 font-medium text-foreground group-hover:bg-[#161616]"
                      style={{ boxShadow: "2px 0 4px rgba(0,0,0,0.4)" }}
                    >
                      {user.name}
                    </td>
                    {/* Email — sticky, fully opaque */}
                    <td
                      className="sticky z-10 border-b border-r border-white/8 bg-neutral-950 px-4 py-2.5 text-sm text-muted-foreground group-hover:bg-[#161616]"
                      style={{ left: "180px", boxShadow: "2px 0 4px rgba(0,0,0,0.4)" }}
                    >
                      {user.email}
                    </td>

                    {/* Day cells */}
                    {daysArray.map((day) => {
                      const record = userRecords.find((r) => r.day === day);

                      if (!record) {
                        return (
                          <td
                            key={day}
                            className="border-b border-r border-white/5 px-1 py-1.5 text-center text-neutral-600 text-xs"
                          >
                            —
                          </td>
                        );
                      }

                      const isUpdating = updatingRecordId === record.id;
                      const statusColor =
                        STATUS_COLORS[record.status] ?? STATUS_COLORS["-"];

                      return (
                        <td
                          key={record.id}
                          className="border-b border-r border-white/5 px-1 py-1 text-center"
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              disabled={isUpdating}
                              className={cn(
                                "mx-auto flex h-7 w-full items-center justify-center gap-0.5 rounded-md text-[11px] font-semibold tracking-wide transition-all hover:brightness-125 focus:outline-none focus:ring-1 focus:ring-white/20",
                                statusColor,
                                isUpdating && "opacity-40 cursor-not-allowed"
                              )}
                            >
                              {isUpdating ? (
                                <Loader2Icon className="size-3 animate-spin" />
                              ) : (
                                record.status
                              )}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="min-w-[130px]">
                              <DropdownMenuItem
                                className="text-green-400 focus:text-green-300"
                                onClick={() => handleStatusChange(record.id, "P")}
                              >
                                P
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-400 focus:text-red-300"
                                onClick={() => handleStatusChange(record.id, "A")}
                              >
                                A
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-orange-400 focus:text-orange-300"
                                onClick={() => handleStatusChange(record.id, "HD")}
                              >
                                HD
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-blue-400 focus:text-blue-300"
                                onClick={() => handleStatusChange(record.id, "H")}
                              >
                                H
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-neutral-400"
                                onClick={() => handleStatusChange(record.id, "-")}
                              >
                                -
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      );
                    })}

                    {/* Summary cells */}
                    {SUMMARY_COLS.map((s) => (
                      <td
                        key={s.key}
                        className={cn(
                          "border-b border-l border-white/8 px-1 py-1 text-center text-xs font-bold tabular-nums",
                          s.color,
                          s.bg
                        )}
                      >
                        {counts[s.key] ?? 0}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {usersMap.size === 0 && (
                <tr>
                  <td
                    colSpan={daysCount + 2 + SUMMARY_COLS.length}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No active staff members found for this sheet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
