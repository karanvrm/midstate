"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  UsersIcon,
  CheckSquareIcon,
  ActivityIcon,
  TrendingUpIcon,
  UserCheckIcon,
} from "lucide-react";
import { SVGBarChart } from "./analytics-charts";

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

interface AnalyticsOwnerClientProps {
  data: {
    totalEdits: number;
    candidatesTouched: number;
    activeRecruiters: number;
    totalActions: number;
    breakdown: StaffBreakdown[];
  };
  headerAction?: React.ReactNode;
}

export function AnalyticsOwnerClient({ data, headerAction }: AnalyticsOwnerClientProps) {
  // Format graphs comparison data per staff member, displaying first names only
  const {
    mainGraphData,
    interestedData,
    notReachableBusyData,
    notInterestedData,
    disconnectingData,
    poorCommsData,
    selectedData,
  } = useMemo(() => {
    const breakdown = data.breakdown || [];
    const getFirstName = (fullName: string) => fullName.trim().split(/\s+/)[0] || fullName;
    return {
      mainGraphData: breakdown.map((b) => ({ label: getFirstName(b.name), value: b.activityCount })),
      interestedData: breakdown.map((b) => ({ label: getFirstName(b.name), value: b.interested })),
      notReachableBusyData: breakdown.map((b) => ({ label: getFirstName(b.name), value: b.notReachableBusy })),
      notInterestedData: breakdown.map((b) => ({ label: getFirstName(b.name), value: b.notInterested })),
      disconnectingData: breakdown.map((b) => ({ label: getFirstName(b.name), value: b.disconnecting })),
      poorCommsData: breakdown.map((b) => ({ label: getFirstName(b.name), value: b.poorComms })),
      selectedData: breakdown.map((b) => ({ label: getFirstName(b.name), value: b.selected })),
    };
  }, [data.breakdown]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl font-heading">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Central dashboard monitoring recruiter performance, unique activities, and historical pipeline changes.
          </p>
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Recruiter Actions (Unique) */}
        <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recruiter Actions
            </CardTitle>
            <ActivityIcon className="h-5 w-5 text-violet-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold font-heading text-foreground">{data.totalActions}</div>
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
            <p className="text-[10px] text-sky-300/80 mt-1">Unique applicants edited historically</p>
          </CardContent>
        </Card>

        {/* Active Recruiters */}
        <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl relative overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Recruiters
            </CardTitle>
            <UserCheckIcon className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent className="pt-2">
            <div className="text-3xl font-bold font-heading text-foreground">{data.activeRecruiters}</div>
            <p className="text-[10px] text-emerald-300/80 mt-1">Recruitment staff with logged logs</p>
          </CardContent>
        </Card>

        {/* Raw Edits Logged */}
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
            <p className="text-[10px] text-amber-300/80 mt-1">Total database updates recorded</p>
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
                  Recruiter Performance Comparison
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Unique candidates worked per recruiter (counts apply the daily single action-limit rule)
                </p>
              </div>
              <Badge variant="outline" className="border-violet-500/30 bg-violet-500/5 text-violet-300 font-mono text-[10px]">
                Main Comparison
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {mainGraphData.length === 0 ? (
              <div className="text-center py-12 text-sm text-muted-foreground">
                No recruiter activity data to display.
              </div>
            ) : (
              <div className="h-[280px] w-full flex items-center justify-center">
                <SVGBarChart
                  data={mainGraphData}
                  color="#a855f7"
                  gradientId="owner-main-grad"
                  height={260}
                  yAxisLabel="Candidates worked"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Graphs Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium text-foreground">Status Breakdown by Recruiter</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Comparison charts showing recruiter performance counts under the unique-candidate-per-day rule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Interested */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                  Interested
                </CardTitle>
                <Badge variant="outline" className="border-sky-500/20 bg-sky-500/5 text-sky-300 text-[10px]">
                  Category
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                {interestedData.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No data</div>
                ) : (
                  <div className="h-[180px] w-full">
                    <SVGBarChart
                      data={interestedData}
                      color="#0ea5e9"
                      gradientId="owner-interested-grad"
                      height={160}
                      yAxisLabel="Interested"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Not Reachable + Busy */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Not Reachable + Busy
                </CardTitle>
                <Badge variant="outline" className="border-amber-500/20 bg-amber-500/5 text-amber-300 text-[10px]">
                  Category
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                {notReachableBusyData.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No data</div>
                ) : (
                  <div className="h-[180px] w-full">
                    <SVGBarChart
                      data={notReachableBusyData}
                      color="#f59e0b"
                      gradientId="owner-not-reachable-busy-grad"
                      height={160}
                      yAxisLabel="Unreachable/Busy"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Not Interested */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Not Interested
                </CardTitle>
                <Badge variant="outline" className="border-red-500/20 bg-red-500/5 text-red-300 text-[10px]">
                  Category
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                {notInterestedData.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No data</div>
                ) : (
                  <div className="h-[180px] w-full">
                    <SVGBarChart
                      data={notInterestedData}
                      color="#ef4444"
                      gradientId="owner-not-interested-grad"
                      height={160}
                      yAxisLabel="Not Interested"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disconnecting */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-fuchsia-400">
                  Disconnecting
                </CardTitle>
                <Badge variant="outline" className="border-fuchsia-500/20 bg-fuchsia-500/5 text-fuchsia-300 text-[10px]">
                  Category
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                {disconnectingData.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No data</div>
                ) : (
                  <div className="h-[180px] w-full">
                    <SVGBarChart
                      data={disconnectingData}
                      color="#ec4899"
                      gradientId="owner-disconnecting-grad"
                      height={160}
                      yAxisLabel="Disconnecting"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Poor Comms */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                  Poor Comms
                </CardTitle>
                <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-300 text-[10px]">
                  Category
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                {poorCommsData.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No data</div>
                ) : (
                  <div className="h-[180px] w-full">
                    <SVGBarChart
                      data={poorCommsData}
                      color="#f97316"
                      gradientId="owner-poor-comms-grad"
                      height={160}
                      yAxisLabel="Poor Comms"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selected */}
            <Card className="border-white/10 bg-neutral-900/20 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Selected
                </CardTitle>
                <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-[10px]">
                  Category
                </Badge>
              </CardHeader>
              <CardContent className="pt-2">
                {selectedData.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">No data</div>
                ) : (
                  <div className="h-[180px] w-full">
                    <SVGBarChart
                      data={selectedData}
                      color="#10b981"
                      gradientId="owner-selected-grad"
                      height={160}
                      yAxisLabel="Selected"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
