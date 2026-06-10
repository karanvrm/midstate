"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateEditTaskModal } from "./create-edit-task-modal";
import { TaskCard } from "./task-card";
import { AlertTriangleIcon, Loader2Icon, PlusIcon } from "lucide-react";
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

export function TasksAdminClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loadError, setLoadError] = useState<string | undefined>();

  useEffect(() => {
    loadTasks();
    loadStaffMembers();
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

  const loadStaffMembers = async () => {
    try {
      const response = await fetch("/api/owner/staff-members");
      if (!response.ok) throw new Error("Failed to load staff");
      const data = await response.json();
      setStaffMembers(data.staffMembers || []);
    } catch (error) {
      console.error("Error loading staff members:", error);
      toast.error("Failed to load staff members");
    }
  };

  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (data: {
    name: string;
    googleSheetUrl: string;
    assignedStaffIds: string[];
  }) => {
    setIsSubmitting(true);
    try {
      const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
      const method = editingTask ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save task");
      }

      const result = await response.json();
      toast.success(result.message);

      handleCloseModal();
      loadTasks();
    } catch (error: any) {
      console.error("Error saving task:", error);
      toast.error(error.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete task");
      }

      const result = await response.json();
      toast.success(result.message);
      loadTasks();
    } catch (error: any) {
      console.error("Error deleting task:", error);
      toast.error(error.message || "Failed to delete task");
    } finally {
      setIsSubmitting(false);
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
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">
              Staff Assignment
            </Badge>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                Task Management
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Assign Google Sheet tasks to staff members and track their progress.
              </p>
            </div>
          </div>

          <Button onClick={() => handleOpenModal()} className="w-full gap-2 md:w-auto">
            <PlusIcon className="size-4" />
            Add Task
          </Button>
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
            <TaskCard
              key={task.id}
              task={task}
              isAdmin
              onEdit={handleOpenModal}
              onDelete={handleDeleteTask}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center">
            <p className="mb-6 text-muted-foreground">No tasks created yet</p>
            <Button onClick={() => handleOpenModal()}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create your first task
            </Button>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateEditTaskModal
        isOpen={isModalOpen}
        isLoading={isSubmitting}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        staffMembers={staffMembers}
        initialData={editingTask}
      />
    </div>
  );
}
