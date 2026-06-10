"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "./task-card";
import { AlertTriangleIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  email: string;
}

interface Task {
  id: string;
  name: string;
  googleSheetUrl: string;
  createdAt: string;
  assignedStaff: StaffMember[];
}

export function TasksStaffClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | undefined>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetch("/api/tasks");
      if (!response.ok) throw new Error("Failed to load tasks");
      const data = await response.json();
      setTasks(data.tasks || []);
      setLoadError(undefined);
    } catch (error) {
      console.error("Error loading tasks:", error);
      setLoadError(
        "The page loaded, but the task directory could not connect to the database. Check your database status, connection string, or network access, then refresh."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <Loader2Icon className="w-8 h-8 animate-spin text-violet-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
        <div className="relative space-y-3">
          <Badge variant="outline" className="w-fit border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">
            Your Tasks
          </Badge>
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              My Tasks
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              View and access the Google Sheet tasks assigned to you.
            </p>
          </div>
        </div>
      </div>

      {/* Error State */}
      {loadError ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-300/10">
            <AlertTriangleIcon className="size-4" />
          </div>
          <div className="space-y-1">
            <h2 className="font-medium text-amber-50">Database connection unavailable</h2>
            <p className="leading-6 text-amber-100/80">{loadError}</p>
          </div>
        </div>
      ) : null}

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center">
            <p className="text-muted-foreground">No tasks assigned to you yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
