"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { CheckIcon, ClockIcon, XIcon, Users2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  status: "PENDING" | "ACTIVE" | "REJECTED";
  createdAt: string;
}

interface OwnerApprovalsProps {
  users: User[];
}

type Action = "approve" | "reject";

const actionCopy = {
  approve: {
    label: "Approve",
    title: "Approve registration?",
    description: "This will activate the user account and allow them to log in.",
    endpoint: "approve",
    loading: "Approving...",
  },
  reject: {
    label: "Reject",
    title: "Reject registration?",
    description: "This will reject the registration request and prevent the user from logging in.",
    endpoint: "reject",
    loading: "Rejecting...",
  },
} as const;

const OwnerApprovals = ({ users }: OwnerApprovalsProps) => {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"PENDING" | "ACTIVE" | "REJECTED" | null>(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState<string | null>(null);

  // Group users by status
  const pendingUsers = users.filter((u) => u.status === "PENDING");
  const activeUsers = users.filter((u) => u.status === "ACTIVE");
  const rejectedUsers = users.filter((u) => u.status === "REJECTED");

  // Filter users based on selected status
  const filteredUsers = selectedStatus ? users.filter((u) => u.status === selectedStatus) : users;

  const handleAction = async (userId: string, action: Action) => {
    setPendingAction(`${action}:${userId}`);
    setMessage(null);

    const response = await fetch(`/api/owner/users/${userId}/${actionCopy[action].endpoint}`, {
      method: "PATCH",
    });

    const data = await response.json().catch(() => ({}));
    setPendingAction(null);

    if (!response.ok) {
      setMessage({
        type: "error",
        text: data.error ?? "Unable to update this registration request.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: data.message ?? "Registration request updated.",
    });
    router.refresh();
  };

  const handleStatusChange = async (userId: string, newStatus: "PENDING" | "ACTIVE" | "REJECTED") => {
    setStatusChangeLoading(`${userId}:${newStatus}`);
    setMessage(null);

    const response = await fetch(`/api/owner/users/${userId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json().catch(() => ({}));
    setStatusChangeLoading(null);

    if (!response.ok) {
      setMessage({
        type: "error",
        text: data.error ?? "Unable to update user status.",
      });
      return;
    }

    setMessage({
      type: "success",
      text: data.message ?? "User status updated successfully.",
    });
    router.refresh();
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge className="border-amber-400/40 bg-amber-400/10 text-amber-200">
            <ClockIcon className="mr-1.5 size-3" />
            Pending
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge className="border-emerald-400/40 bg-emerald-400/10 text-emerald-200">
            <CheckIcon className="mr-1.5 size-3" />
            Active
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="border-red-400/40 bg-red-400/10 text-red-200">
            <XIcon className="mr-1.5 size-3" />
            Rejected
          </Badge>
        );
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
    status: "PENDING" | "ACTIVE" | "REJECTED";
    bgColor: string;
    borderColor: string;
    textColor: string;
    description: string;
  }) => (
    <button
      onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
      className={`flex flex-col gap-2 rounded-lg border p-5 transition-all hover:shadow-lg ${
        selectedStatus === status
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
      {message ? (
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
      ) : null}

      {/* Summary Cards - Clickable */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          label="Pending"
          count={pendingUsers.length}
          icon={ClockIcon}
          status="PENDING"
          bgColor="bg-amber-400/10"
          borderColor="border-amber-400/40"
          textColor="text-amber-300"
          description="Awaiting approval"
        />
        <StatusCard
          label="Active"
          count={activeUsers.length}
          icon={CheckIcon}
          status="ACTIVE"
          bgColor="bg-emerald-400/10"
          borderColor="border-emerald-400/40"
          textColor="text-emerald-300"
          description="Active members"
        />
        <StatusCard
          label="Rejected"
          count={rejectedUsers.length}
          icon={XIcon}
          status="REJECTED"
          bgColor="bg-red-400/10"
          borderColor="border-red-400/40"
          textColor="text-red-300"
          description="Rejected applications"
        />
      </div>

      {/* Main Staff List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              {selectedStatus ? `Showing ${selectedStatus} staff` : "Showing all staff"}
            </span>
            <Badge variant="outline" className="border-border/50 bg-background text-muted-foreground">
              {filteredUsers.length}
            </Badge>
          </div>
          {selectedStatus && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedStatus(null)}
              className="border-border/50 text-muted-foreground hover:text-foreground"
            >
              Clear filter
            </Button>
          )}
        </div>

        {filteredUsers.length ? (
          <div className="overflow-hidden rounded-lg border border-border/70 bg-card/90 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <Table>
              <TableHeader>
                <TableRow className="border-border/70 hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-border/70 hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(user.createdAt))}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <StatusChangeDropdown
                          user={user}
                          isLoading={statusChangeLoading}
                          onStatusChange={handleStatusChange}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-border/70 px-6 py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg border border-border/70 bg-background/80">
              <Users2Icon className="size-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              {selectedStatus ? `No ${selectedStatus.toLowerCase()} staff` : "No staff members"}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {selectedStatus
                ? `There are no staff members with ${selectedStatus.toLowerCase()} status.`
                : "Staff registrations will appear here once users sign up for the platform."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ApprovalDialogProps {
  action: Action;
  userName: string;
  isLoading: boolean;
  onConfirm: () => void;
}

const ApprovalDialog = ({ action, userName, isLoading, onConfirm }: ApprovalDialogProps) => {
  const copy = actionCopy[action];

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant={action === "approve" ? "primary" : "outline"}
          disabled={isLoading}
          className={action === "reject" ? "border-red-400/40 text-red-200 hover:bg-red-400/10 hover:text-red-100" : ""}
        >
          {action === "approve" ? <CheckIcon className="mr-2 size-4" /> : <XIcon className="mr-2 size-4" />}
          {isLoading ? copy.loading : copy.label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-border/80 bg-neutral-950">
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.description} This action will apply to {userName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={() => {
              onConfirm();
            }}
            className={action === "reject" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {isLoading ? copy.loading : copy.label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface StatusChangeDropdownProps {
  user: User;
  isLoading: string | null;
  onStatusChange: (userId: string, newStatus: "PENDING" | "ACTIVE" | "REJECTED") => void;
}

const StatusChangeDropdown = ({ user, isLoading, onStatusChange }: StatusChangeDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [selectedNewStatus, setSelectedNewStatus] = useState<"PENDING" | "ACTIVE" | "REJECTED" | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const statuses: Array<{
    value: "PENDING" | "ACTIVE" | "REJECTED";
    label: string;
    icon: React.ComponentType<any>;
    color: string;
  }> = [
    { value: "PENDING", label: "Pending", icon: ClockIcon, color: "text-amber-300" },
    { value: "ACTIVE", label: "Active", icon: CheckIcon, color: "text-emerald-300" },
    { value: "REJECTED", label: "Rejected", icon: XIcon, color: "text-red-300" },
  ];

  const currentStatusConfig = statuses.find((s) => s.value === user.status);
  const otherStatuses = statuses.filter((s) => s.value !== user.status);

  const isChanging = (status: string) => isLoading === `${user.id}:${status}`;
  const isLoadingAny = isLoading !== null && isLoading.startsWith(user.id);

  const handleConfirmStatusChange = () => {
    if (selectedNewStatus) {
      onStatusChange(user.id, selectedNewStatus);
      setShowConfirmDialog(false);
      setSelectedNewStatus(null);
    }
  };

  const handleSelectNewStatus = (status: "PENDING" | "ACTIVE" | "REJECTED") => {
    setSelectedNewStatus(status);
    setShowConfirmDialog(true);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {currentStatusConfig && (
        <div className="flex items-center gap-1 rounded-md border border-border/50 bg-background px-2 py-1">
          <currentStatusConfig.icon className={`size-3.5 ${currentStatusConfig.color}`} />
          <span className="text-xs font-medium">{currentStatusConfig.label}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="rounded border border-border/50 bg-background p-1 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoadingAny}
          title="Change user status"
        >
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {open && !isLoadingAny && (
          <div className="absolute right-0 z-10 mt-1 w-44 rounded-md border border-border/50 bg-card shadow-lg">
            {otherStatuses.map((status) => (
              <button
                key={status.value}
                onClick={() => handleSelectNewStatus(status.value)}
                className="flex w-full items-center gap-2 border-b border-border/20 px-3 py-2 text-sm transition-colors hover:bg-muted last:border-b-0"
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
              Change {user.name}'s status to{" "}
              {selectedNewStatus ? statuses.find((s) => s.value === selectedNewStatus)?.label : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will change their status from {user.status} to{" "}
              {selectedNewStatus ? statuses.find((s) => s.value === selectedNewStatus)?.label : ""}. They
              will be {selectedNewStatus === "ACTIVE" ? " able to" : " unable to"} access the platform
              accordingly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={selectedNewStatus ? isChanging(selectedNewStatus) : false}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={selectedNewStatus ? isChanging(selectedNewStatus) : false}
              onClick={handleConfirmStatusChange}
              className={
                selectedNewStatus === "REJECTED"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {selectedNewStatus ? (isChanging(selectedNewStatus) ? "Changing..." : "Confirm") : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OwnerApprovals;
