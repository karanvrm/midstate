"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRightIcon, CheckSquareIcon, PencilIcon, TrashIcon } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: {
    id: string;
    name: string;
    googleSheetUrl: string;
    createdAt: string;
    assignedStaff: Array<{
      id: string;
      name: string;
    }>;
  };
  isAdmin?: boolean;
  onEdit?: (task: any) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, isAdmin, onEdit, onDelete }: TaskCardProps) {
  const handleOpenSheet = () => {
    window.open(task.googleSheetUrl, "_blank");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete?.(task.id);
    }
  };

  const createdDate = new Date(task.createdAt);
  const formattedDate = format(createdDate, "MMM dd, yyyy");

  return (
    <Card className="group relative overflow-hidden rounded-2xl border-white/10 bg-neutral-900/30 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      
      <CardHeader className="relative border-b border-white/5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <CheckSquareIcon className="size-5 text-violet-300" />
          </div>
          {isAdmin && (
            <Badge variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] uppercase text-muted-foreground">
              Created {formattedDate}
            </Badge>
          )}
        </div>
        <CardTitle className="mt-4 line-clamp-2 text-xl font-medium text-foreground">
          {task.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-5 pt-5">
        {/* Assigned Staff Badges */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Assigned To
          </p>
          <div className="flex flex-wrap gap-2">
            {task.assignedStaff.length > 0 ? (
              task.assignedStaff.map((staff) => (
                <Badge
                  key={staff.id}
                  variant="outline"
                  className="border-violet-400/30 bg-violet-400/10 text-violet-100"
                >
                  {staff.name}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No staff assigned</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div />
          <div className="flex shrink-0 items-center gap-2">
            {isAdmin && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2 border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit?.(task)}
                >
                  <PencilIcon className="size-3.5" />
                  Edit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2 border-red-400/30 bg-red-400/10 text-red-200 hover:bg-red-400/20 hover:text-red-100"
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
              className="gap-2 border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 hover:text-white"
              onClick={handleOpenSheet}
            >
              <ArrowUpRightIcon className="size-3.5" />
              Open
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
