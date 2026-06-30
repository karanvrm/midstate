"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon, CheckSquareIcon, PencilIcon, TrashIcon, Users2Icon } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    createdAt: string;
    assignedStaff: Array<{
      id: string;
      name: string;
    }>;
    candidateCount?: number;
    status?: string;
  };
  isAdmin?: boolean;
  onEdit?: (task: any) => void;
  onDelete?: (taskId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-violet-500/10 border-violet-500/20",
    text: "text-violet-300",
    dot: "bg-violet-400",
  },
};

export function TaskCard({ task, isAdmin, onEdit, onDelete }: TaskCardProps) {
  const router = useRouter();

  const handleOpenSheet = () => {
    router.push(`/dashboard/staff/my-tasks?taskId=${task.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete?.(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(task);
  };

  const createdDate = new Date(task.createdAt);
  const formattedDate = format(createdDate, "MMM dd, yyyy");

  const statusCfg = STATUS_CONFIG[task.status ?? "PENDING"] ?? STATUS_CONFIG.PENDING;

  return (
    <Card 
      onClick={handleOpenSheet}
      className="group relative overflow-hidden rounded-2xl border-white/10 bg-neutral-900/30 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      
      <CardHeader className="relative border-b border-white/5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <CheckSquareIcon className="size-5 text-violet-300" />
          </div>
          
          <div className="flex flex-col items-end gap-1.5">
            {/* Status Badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${statusCfg.bg} ${statusCfg.text}`}>
              <span className={`size-1.5 rounded-full ${statusCfg.dot}`} />
              {statusCfg.label}
            </span>

            <span className="text-[10px] uppercase text-muted-foreground">
              {isAdmin ? `Created ${formattedDate}` : `Assigned ${formattedDate}`}
            </span>
          </div>
        </div>
        <CardTitle className="mt-4 line-clamp-2 text-xl font-medium text-foreground group-hover:text-violet-200 transition-colors">
          {task.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-5 pt-5">
        {/* Info Rows */}
        <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
          {/* Assigned Staff */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Assigned To
            </p>
            <div className="flex flex-wrap gap-1.5">
              {task.assignedStaff.length > 0 ? (
                task.assignedStaff.map((staff) => (
                  <Badge
                    key={staff.id}
                    variant="outline"
                    className="border-violet-400/30 bg-violet-400/10 text-violet-100 text-[11px] px-2 py-0"
                  >
                    {staff.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No staff assigned</span>
              )}
            </div>
          </div>

          {/* Candidate Count */}
          <div className="text-right space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Candidates
            </p>
            <div className="flex items-center justify-end gap-1.5 text-sm font-semibold text-foreground">
              <Users2Icon className="size-4 text-violet-300" />
              {task.candidateCount ?? 0}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div />
          <div className="flex shrink-0 items-center gap-2">
            {isAdmin && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/20 hover:text-red-100"
                  onClick={handleDelete}
                >
                  <TrashIcon className="size-3.5" />
                </Button>
              </>
            )}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5 border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenSheet();
              }}
            >
              <ArrowUpRightIcon className="size-3.5" />
              Open Candidates
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
