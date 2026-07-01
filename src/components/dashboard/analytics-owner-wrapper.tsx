"use client";

import { useEffect, useState } from "react";
import { Loader2Icon, SlidersHorizontalIcon } from "lucide-react";
import type { FilterOption } from "@/lib/analytics";
import { AnalyticsOwnerClient } from "@/components/dashboard/analytics-owner-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StaffBreakdown {
  id: string;
  name: string;
  email: string;
  role: string;
  activityCount: number;
  candidatesTouched: number;
  editsCount: number;
  interested: number;
  notReachableBusy: number;
  notInterested: number;
  disconnecting: number;
  poorComms: number;
  selected: number;
}

interface OwnerAnalyticsData {
  totalEdits: number;
  candidatesTouched: number;
  activeRecruiters: number;
  totalActions: number;
  breakdown: StaffBreakdown[];
}

interface AnalyticsOwnerWrapperProps {
  initialData: OwnerAnalyticsData;
}

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_3_months", label: "Last 3 Months" },
];

export function AnalyticsOwnerWrapper({ initialData }: AnalyticsOwnerWrapperProps) {
  const [filter, setFilter] = useState<FilterOption>("today");
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/analytics/owner?filter=${filter}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load analytics.");
        }

        const nextData = (await response.json()) as OwnerAnalyticsData;
        setData(nextData);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unable to load analytics.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => controller.abort();
  }, [filter]);

  const filterControl = (
    <div className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-neutral-900/60 px-3 py-2 sm:w-auto">
      <SlidersHorizontalIcon className="size-4 shrink-0 text-violet-300" />
      <Select value={filter} onValueChange={(value) => setFilter(value as FilterOption)}>
        <SelectTrigger className="h-9 w-full min-w-[160px] border-white/10 bg-white/[0.03] text-sm sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FILTER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLoading ? <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" /> : null}
    </div>
  );

  return (
    <>
      {error ? <p className="mx-auto mb-3 max-w-6xl text-sm text-red-300">{error}</p> : null}
      <AnalyticsOwnerClient data={data} headerAction={filterControl} />
    </>
  );
}
