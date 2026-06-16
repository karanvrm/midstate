"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckIcon,
  ClockIcon,
  XIcon,
  EyeIcon,
  DownloadIcon,
  FileTextIcon,
} from "lucide-react";

interface StaffApplication {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  preferredLocation: string;
  jobTitle: string;
  resumeName: string;
  resumeType: string;
  status: string;
  createdAt: string;
}

interface StaffApplicationsClientProps {
  applications: StaffApplication[];
}

const statusConfig = {
  Active: {
    label: "Active",
    badgeClass: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    icon: ClockIcon,
  },
  Assigned: {
    label: "Assigned",
    badgeClass: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    icon: CheckIcon,
  },
  Rejected: {
    label: "Rejected",
    badgeClass: "border-red-400/40 bg-red-400/10 text-red-200",
    icon: XIcon,
  },
} as const;

export default function StaffApplicationsClient({
  applications,
}: StaffApplicationsClientProps) {
  return (
    <div className="space-y-8">

      {/* Applications Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Applications assigned to you
          </span>
          <Badge
            variant="outline"
            className="border-border/50 bg-background text-muted-foreground"
          >
            {applications.length}
          </Badge>
        </div>

        {applications.length ? (
          <div className="overflow-hidden rounded-lg border border-border/70 bg-card/90 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead>Applied For</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Preferred Location</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const config =
                    statusConfig[app.status as keyof typeof statusConfig];
                  const StatusIcon = config?.icon ?? ClockIcon;

                  return (
                    <TableRow
                      key={app.id}
                      className="border-border/70 hover:bg-muted/30"
                    >
                      <TableCell className="font-medium text-foreground py-4">
                        <div className="font-semibold text-foreground">
                          {app.jobTitle}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.fullName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.phoneNumber}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {app.preferredLocation}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-violet-300 hover:text-violet-200 hover:bg-violet-500/10 flex items-center gap-1"
                          >
                            <a
                              href={`/api/staff/applications/${app.id}/resume`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Resume"
                            >
                              <EyeIcon className="h-4 w-4" />
                              <span className="text-xs">View</span>
                            </a>
                          </Button>
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-sky-300 hover:text-sky-200 hover:bg-sky-500/10 flex items-center gap-1"
                          >
                            <a
                              href={`/api/staff/applications/${app.id}/resume?download=true`}
                              title="Download Resume"
                            >
                              <DownloadIcon className="h-4 w-4" />
                              <span className="text-xs">Download</span>
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium ${config?.badgeClass ?? ""
                            }`}
                        >
                          <StatusIcon className="size-3.5" />
                          <span>{config?.label ?? app.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border/70 px-6 py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg border border-border/70 bg-background/80">
              <FileTextIcon className="size-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              No applications assigned yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Applications assigned to you by an admin or owner will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
