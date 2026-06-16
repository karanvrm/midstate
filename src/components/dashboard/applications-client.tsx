"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckIcon,
  ClockIcon,
  XIcon,
  EyeIcon,
  DownloadIcon,
  FileTextIcon,
  UserPlusIcon,
  LoaderCircleIcon,
  ChevronDownIcon,
  UserCheckIcon,
} from "lucide-react";

interface Application {
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
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string } | null;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
}

interface ApplicationsClientProps {
  applications: Application[];
}

const statusConfig = {
  Active: {
    label: "Active",
    badgeClass: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    icon: ClockIcon,
    color: "text-emerald-300",
  },
  Assigned: {
    label: "Assigned",
    badgeClass: "border-violet-400/40 bg-violet-400/10 text-violet-200",
    icon: CheckIcon,
    color: "text-violet-300",
  },
  Rejected: {
    label: "Rejected",
    badgeClass: "border-red-400/40 bg-red-400/10 text-red-200",
    icon: XIcon,
    color: "text-red-300",
  },
} as const;

export default function ApplicationsClient({ applications }: ApplicationsClientProps) {
  const router = useRouter();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Status stats
  const activeCount = applications.filter((a) => a.status === "Active").length;
  const assignedCount = applications.filter((a) => a.status === "Assigned").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  const filteredApplications = selectedStatusFilter
    ? applications.filter((a) => a.status === selectedStatusFilter)
    : applications;

  const handleStatusChange = async (appId: string, newStatus: string) => {
    setStatusChangeLoading(`${appId}:${newStatus}`);
    setMessage(null);

    try {
      const response = await fetch(`/api/owner/applications/${appId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      setStatusChangeLoading(null);

      if (!response.ok) {
        setMessage({
          type: "error",
          text: data.error ?? "Unable to update application status.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: data.message ?? "Application status updated successfully.",
      });
      router.refresh();
    } catch (err) {
      setStatusChangeLoading(null);
      setMessage({
        type: "error",
        text: "An error occurred while updating the status.",
      });
    }
  };

  const StatusCard = ({
    label,
    count,
    icon: Icon,
    status,
    bgColor,
    borderColor,
    textColor,
    description,
  }: {
    label: string;
    count: number;
    icon: React.ComponentType<any>;
    status: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    description: string;
  }) => (
    <button
      onClick={() => setSelectedStatusFilter(selectedStatusFilter === status ? null : status)}
      className={`flex flex-col text-left gap-2 rounded-lg border p-5 transition-all hover:shadow-lg ${selectedStatusFilter === status
        ? `${borderColor} ${bgColor} shadow-[0_24px_80px_rgba(0,0,0,0.35)]`
        : "border-border/70 bg-neutral-950/80 hover:border-border/50"
        }`}
    >
      <div className={`inline-flex w-fit items-center gap-2 rounded-full ${borderColor} ${bgColor} px-2 py-1`}>
        <Icon className={`size-3.5 ${textColor}`} />
        <span className={`text-xs font-medium ${textColor}`}>{label}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">{count}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </button>
  );

  return (
    <div className="space-y-8">
      {message && (
        <div
          className={
            message.type === "success"
              ? "rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
              : "rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-200"
          }
          role="status"
        >
          {message.text}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          label="Active"
          count={activeCount}
          icon={ClockIcon}
          status="Active"
          bgColor="bg-emerald-400/10"
          borderColor="border-emerald-400/40"
          textColor="text-emerald-300"
          description="Awaiting processing"
        />
        <StatusCard
          label="Assigned"
          count={assignedCount}
          icon={CheckIcon}
          status="Assigned"
          bgColor="bg-violet-400/10"
          borderColor="border-violet-400/40"
          textColor="text-violet-300"
          description="Candidates assigned to staff"
        />
        <StatusCard
          label="Rejected"
          count={rejectedCount}
          icon={XIcon}
          status="Rejected"
          bgColor="bg-red-400/10"
          borderColor="border-red-400/40"
          textColor="text-red-300"
          description="Archived applications"
        />
      </div>

      {/* Applications Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedStatusFilter ? `Showing ${selectedStatusFilter} applications` : "Showing all applications"}
            </span>
            <Badge variant="outline" className="border-border/50 bg-background text-muted-foreground">
              {filteredApplications.length}
            </Badge>
          </div>
          {selectedStatusFilter && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedStatusFilter(null)}
              className="border-border/50 text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </Button>
          )}
        </div>

        {filteredApplications.length ? (
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
                  <TableHead>Assign</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id} className="border-border/70 hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground py-4 border-r border-black">
                      <div className="font-semibold text-foreground">{app.jobTitle}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground border-r border-black">{app.fullName}</TableCell>
                    <TableCell className="text-muted-foreground border-r border-black">{app.phoneNumber}</TableCell>
                    <TableCell className="text-muted-foreground border-r border-black">{app.email}</TableCell>
                    <TableCell className="text-muted-foreground border-r border-black">{app.preferredLocation}</TableCell>
                    <TableCell className="border-r border-black">
                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-violet-300 hover:text-violet-200 hover:bg-violet-500/10 flex items-center gap-1"
                        >
                          <a
                            href={`/api/owner/applications/${app.id}/resume`}
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
                            href={`/api/owner/applications/${app.id}/resume?download=true`}
                            title="Download Resume"
                          >
                            <DownloadIcon className="h-4 w-4" />
                            <span className="text-xs">Download</span>
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="border-r border-black">
                      <StatusDropdown
                        application={app}
                        isLoading={statusChangeLoading}
                        onStatusChange={handleStatusChange}
                      />
                    </TableCell>
                    <TableCell>
                      <AssignCell
                        application={app}
                        onAssigned={() => {
                          setMessage({ type: "success", text: "Application assigned successfully." });
                          router.refresh();
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border/70 px-6 py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg border border-border/70 bg-background/80">
              <FileTextIcon className="size-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              {selectedStatusFilter ? `No ${selectedStatusFilter.toLowerCase()} applications` : "No applications"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {selectedStatusFilter
                ? `There are no job applications with ${selectedStatusFilter.toLowerCase()} status.`
                : "Job applications will appear here once candidates apply on the platform."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── StatusDropdown ────────────────────────────────────────────────────────────

interface StatusDropdownProps {
  application: Application;
  isLoading: string | null;
  onStatusChange: (appId: string, newStatus: string) => void;
}

function StatusDropdown({ application, isLoading, onStatusChange }: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const statuses = [
    { value: "Active", label: "Active", icon: ClockIcon, color: "text-emerald-300" },
    { value: "Assigned", label: "Assigned", icon: CheckIcon, color: "text-violet-300" },
    { value: "Rejected", label: "Rejected", icon: XIcon, color: "text-red-300" },
  ] as const;

  const currentConfig = statuses.find((s) => s.value === application.status) || statuses[0];
  const otherStatuses = statuses.filter((s) => s.value !== application.status);

  const isChanging = (status: string) => isLoading === `${application.id}:${status}`;
  const isLoadingAny = isLoading !== null && isLoading.startsWith(application.id);

  const handleConfirmStatusChange = () => {
    if (selectedNewStatus) {
      onStatusChange(application.id, selectedNewStatus);
      setShowConfirmDialog(false);
      setSelectedNewStatus(null);
    }
  };

  const handleSelectNewStatus = (status: string) => {
    setSelectedNewStatus(status);
    setShowConfirmDialog(true);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 rounded-md border border-border/50 bg-background px-2.5 py-1 ${statusConfig[application.status as keyof typeof statusConfig]?.badgeClass || ""}`}>
        <currentConfig.icon className="size-3.5" />
        <span className="text-xs font-medium">{currentConfig.label}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="rounded border border-border/50 bg-background p-1 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoadingAny}
          title="Change status"
        >
          <svg className="size-4 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && !isLoadingAny && (
          <div className="absolute right-0 z-10 mt-1 w-44 rounded-md border border-border/50 bg-card shadow-lg">
            {otherStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleSelectNewStatus(status.value)}
                className="flex w-full items-center gap-2 border-b border-border/20 px-3 py-2 text-sm transition-colors hover:bg-muted last:border-b-0 text-left text-foreground"
              >
                <status.icon className={`size-4 ${status.color}`} />
                <span>Change to {status.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="border-border/80 bg-neutral-950">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Change application status?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change {application.fullName}&apos;s application status from {application.status} to {selectedNewStatus}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={selectedNewStatus ? isChanging(selectedNewStatus) : false}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={selectedNewStatus ? isChanging(selectedNewStatus) : false}
              onClick={handleConfirmStatusChange}
              className={selectedNewStatus === "Rejected" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {selectedNewStatus ? (isChanging(selectedNewStatus) ? "Changing..." : "Confirm") : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── AssignCell ────────────────────────────────────────────────────────────────

interface AssignCellProps {
  application: Application;
  onAssigned: () => void;
}

function AssignCell({ application, onAssigned }: AssignCellProps) {
  const [open, setOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleOpen = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    setError(null);

    if (staffList.length === 0) {
      setLoadingStaff(true);
      try {
        const res = await fetch("/api/owner/staff-members");
        const data = await res.json();
        if (res.ok) {
          setStaffList(data.staffMembers ?? []);
        } else {
          setError(data.error ?? "Failed to load staff members.");
        }
      } catch {
        setError("Failed to load staff members.");
      } finally {
        setLoadingStaff(false);
      }
    }
  };

  const handleAssign = async (staffId: string, staffName: string) => {
    setAssigning(true);
    setError(null);
    try {
      const res = await fetch(`/api/owner/applications/${application.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffUserId: staffId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to assign application.");
      } else {
        setOpen(false);
        onAssigned();
      }
    } catch {
      setError("Failed to assign application.");
    } finally {
      setAssigning(false);
    }
  };

  const isAlreadyAssigned = !!application.assignedToId;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        disabled={assigning}
        title={isAlreadyAssigned ? "Reassign application" : "Assign application"}
        className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 ${isAlreadyAssigned
            ? "border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20"
            : "border-border/50 bg-background text-muted-foreground hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
          }`}
      >
        {assigning ? (
          <LoaderCircleIcon className="size-3.5 animate-spin" />
        ) : isAlreadyAssigned ? (
          <UserCheckIcon className="size-3.5" />
        ) : (
          <UserPlusIcon className="size-3.5" />
        )}
        <span>{isAlreadyAssigned ? "Reassign" : "Assign"}</span>
        <ChevronDownIcon className={`size-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-56 rounded-xl border border-border/60 bg-neutral-950 shadow-2xl ring-1 ring-black/20">
          <div className="border-b border-border/40 px-3 py-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Select Staff Member
            </p>
          </div>

          <div className="max-h-52 overflow-y-auto">
            {loadingStaff ? (
              <div className="flex items-center justify-center gap-2 px-3 py-4 text-xs text-muted-foreground">
                <LoaderCircleIcon className="size-3.5 animate-spin" />
                Loading staff...
              </div>
            ) : error ? (
              <div className="px-3 py-3 text-xs text-red-400">{error}</div>
            ) : staffList.length === 0 ? (
              <div className="px-3 py-3 text-xs text-muted-foreground">
                No active staff members found.
              </div>
            ) : (
              staffList.map((staff) => {
                const isCurrentAssignee = staff.id === application.assignedToId;
                return (
                  <button
                    key={staff.id}
                    onClick={() => handleAssign(staff.id, staff.name)}
                    disabled={assigning || isCurrentAssignee}
                    className={`flex w-full items-center gap-2.5 border-b border-border/20 px-3 py-2.5 text-left text-sm transition-colors last:border-b-0 disabled:cursor-not-allowed ${isCurrentAssignee
                        ? "bg-violet-500/10 text-violet-300 opacity-70"
                        : "text-foreground hover:bg-white/[0.04] hover:text-foreground"
                      }`}
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-violet-300">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-xs">{staff.name}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{staff.email}</div>
                    </div>
                    {isCurrentAssignee && (
                      <CheckIcon className="size-3.5 shrink-0 text-violet-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}