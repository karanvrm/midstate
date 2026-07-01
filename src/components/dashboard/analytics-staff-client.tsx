"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  CheckSquareIcon,
  ActivityIcon,
  CalendarIcon,
  TrendingUpIcon,
} from "lucide-react";
import { SVGLineChart } from "./analytics-charts";

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

interface AnalyticsStaffClientProps {
  data: {
    totalEdits: number;
    candidatesTouched: number;
    activityCount: number;
    activeDays: number;
    trend: TrendPoint[];
  };
  headerAction?: React.ReactNode;
}

export function AnalyticsStaffClient({ data, headerAction }: AnalyticsStaffClientProps) {
  // Format graph data from the 7-day trend array
  const {
    mainGraphData,
    interestedData,
    notReachableBusyData,
    notInterestedData,
    disconnectingData,
    poorCommsData,
    selectedData,
  } = useMemo(() => {
    const trend = data.trend || [];
    return {
      mainGraphData: trend.map((t) => ({ label: t.date, value: t.uniqueCandidates })),
      interestedData: trend.map((t) => ({ label: t.date, value: t.interested })),
      notReachableBusyData: trend.map((t) => ({ label: t.date, value: t.notReachableBusy })),
      notInterestedData: trend.map((t) => ({ label: t.date, value: t.notInterested })),
      disconnectingData: trend.map((t) => ({ label: t.date, value: t.disconnecting })),
      poorCommsData: trend.map((t) => ({ label: t.date, value: t.poorComms })),
      selectedData: trend.map((t) => ({ label: t.date, value: t.selected })),
    };
  }, [data.trend]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl font-heading">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personal workspace performance and pipeline trends for the last 7 days.
          </p>
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* My Unique Actions */}
        <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              My Unique Actions
            </CardTitle>
            <ActivityIcon className="h-5 w-5 text-violet-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold font-heading text-foreground">{data.activityCount}</div>
            <p className="text-[10px] text-violet-300/80 mt-1 flex items-center gap-1">
              <TrendingUpIcon className="h-3 w-3" />
              Counting Rule active (daily limit)
            </p>
          </CardContent>
        </Card>

        {/* Candidates Touched */}
        <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Candidates Touched
            </CardTitle>
            <UsersIcon className="h-5 w-5 text-sky-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold font-heading text-foreground">{data.candidatesTouched}</div>
            <p className="text-[10px] text-sky-300/80 mt-1">Unique applicants edited by you</p>
          </CardContent>
        </Card>

        {/* Active Days */}
        <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Days
            </CardTitle>
            <CalendarIcon className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold font-heading text-foreground">{data.activeDays}</div>
            <p className="text-[10px] text-emerald-300/80 mt-1">Total calendar days of activity</p>
          </CardContent>
        </Card>

        {/* Raw Edits */}
        <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Raw Edits Logged
            </CardTitle>
            <CheckSquareIcon className="h-5 w-5 text-amber-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold font-heading text-foreground">{data.totalEdits}</div>
            <p className="text-[10px] text-amber-300/80 mt-1">Total database edits tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphs Section */}
      <div className="space-y-8">
        {/* Main Graph */}
        <Card className="border-white/10 bg-neutral-900/30 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-medium text-foreground">
                  Unique Candidates Worked Per Day
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing unique candidate interactions over the last 7 calendar days
                </p>
              </div>
              <Badge variant="outline" className="border-violet-500/30 bg-violet-500/5 text-violet-300 font-mono text-[10px]">
                Last 7 Days
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[260px] w-full flex items-center justify-center">
              <SVGLineChart
                data={mainGraphData}
                color="#a855f7"
                gradientId="main-unique-grad"
                height={240}
                yAxisLabel="Candidates"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Graphs Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-foreground">Pipeline Category Trends</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Daily trend graphs — each candidate counted once per day using their final recorded status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Interested — Blue */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Interested
                </CardTitle>
                <Badge variant="outline" className="border-sky-500/20 bg-sky-500/5 text-sky-300 text-[10px]">
                  Status
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[180px] w-full">
                  <SVGLineChart
                    data={interestedData}
                    color="#0ea5e9"
                    gradientId="interested-grad"
                    height={160}
                    yAxisLabel="Interested"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Not Reachable + Busy */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Not Reachable + Busy
                </CardTitle>
                <Badge variant="outline" className="border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px]">
                  Status
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[180px] w-full">
                  <SVGLineChart
                    data={notReachableBusyData}
                    color="#f59e0b"
                    gradientId="not-reachable-busy-grad"
                    height={160}
                    yAxisLabel="Unreachable/Busy"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Not Interested */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Not Interested
                </CardTitle>
                <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-300 text-[10px]">
                  Status
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[180px] w-full">
                  <SVGLineChart
                    data={notInterestedData}
                    color="#ef4444"
                    gradientId="not-interested-grad"
                    height={160}
                    yAxisLabel="Not Interested"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Disconnecting */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-fuchsia-400">
                  Disconnecting
                </CardTitle>
                <Badge variant="outline" className="border-fuchsia-500/20 bg-fuchsia-500/5 text-fuchsia-300 text-[10px]">
                  Status
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[180px] w-full">
                  <SVGLineChart
                    data={disconnectingData}
                    color="#ec4899"
                    gradientId="disconnecting-grad"
                    height={160}
                    yAxisLabel="Disconnecting"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Poor Comms */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Poor Comms
                </CardTitle>
                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-300 text-[10px]">
                  Status
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[180px] w-full">
                  <SVGLineChart
                    data={poorCommsData}
                    color="#f97316"
                    gradientId="poor-comms-grad"
                    height={160}
                    yAxisLabel="Poor Comms"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selected — Green */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Selected
                </CardTitle>
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-[10px]">
                  Status
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[180px] w-full">
                  <SVGLineChart
                    data={selectedData}
                    color="#10b981"
                    gradientId="selected-grad"
                    height={160}
                    yAxisLabel="Selected"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
