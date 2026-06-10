"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2Icon, SearchIcon, AlertCircleIcon } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
}

interface CreateEditTaskModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; googleSheetUrl: string; assignedStaffIds: string[] }) => void;
  staffMembers: StaffMember[];
  initialData?: {
    id: string;
    name: string;
    googleSheetUrl: string;
    assignedStaff: StaffMember[];
  };
}

export function CreateEditTaskModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
  staffMembers,
  initialData,
}: CreateEditTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTaskName(initialData.name);
      setGoogleSheetUrl(initialData.googleSheetUrl);
      setSelectedStaffIds(initialData.assignedStaff.map((s) => s.id));
    } else {
      setTaskName("");
      setGoogleSheetUrl("");
      setSelectedStaffIds([]);
    }
    setSearchQuery("");
    setErrors({});
  }, [initialData, isOpen]);

  const filteredStaffMembers = useMemo(() => {
    if (!searchQuery) return staffMembers;
    const query = searchQuery.toLowerCase();
    return staffMembers.filter(
      (staff) =>
        staff.name.toLowerCase().includes(query) ||
        staff.email.toLowerCase().includes(query),
    );
  }, [staffMembers, searchQuery]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!taskName.trim()) {
      newErrors.taskName = "Task name is required";
    }

    if (!googleSheetUrl.trim()) {
      newErrors.googleSheetUrl = "Google Sheet URL is required";
    } else if (!isValidUrl(googleSheetUrl)) {
      newErrors.googleSheetUrl = "Invalid URL format";
    }

    if (selectedStaffIds.length === 0) {
      newErrors.staffMembers = "Assign at least one staff member";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name: taskName.trim(),
        googleSheetUrl: googleSheetUrl.trim(),
        assignedStaffIds: selectedStaffIds,
      });
    }
  };

  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId],
    );
  };

  const selectedStaffCount = selectedStaffIds.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {initialData
              ? "Update task details and assigned staff members"
              : "Create a new task and assign it to staff members"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-6 -mr-6">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name" className="text-sm font-medium">
              Task Name *
            </Label>
            <Input
              id="task-name"
              placeholder="Enter task name (e.g., Data Entry, Lead Processing)"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                if (errors.taskName) {
                  setErrors({ ...errors, taskName: "" });
                }
              }}
              className={errors.taskName ? "border-red-500" : ""}
            />
            {errors.taskName && (
              <div className="flex items-center gap-2 text-xs text-red-500">
                <AlertCircleIcon className="size-3.5" />
                {errors.taskName}
              </div>
            )}
          </div>

          {/* Google Sheet URL */}
          <div className="space-y-2">
            <Label htmlFor="sheet-url" className="text-sm font-medium">
              Google Sheet URL *
            </Label>
            <Input
              id="sheet-url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={googleSheetUrl}
              onChange={(e) => {
                setGoogleSheetUrl(e.target.value);
                if (errors.googleSheetUrl) {
                  setErrors({ ...errors, googleSheetUrl: "" });
                }
              }}
              className={errors.googleSheetUrl ? "border-red-500" : ""}
            />
            {errors.googleSheetUrl && (
              <div className="flex items-center gap-2 text-xs text-red-500">
                <AlertCircleIcon className="size-3.5" />
                {errors.googleSheetUrl}
              </div>
            )}
          </div>

          {/* Assigned Staff */}
          <div className="space-y-2 flex flex-col min-h-[200px]">
            <Label className="text-sm font-medium">
              Assign Staff ({selectedStaffCount} selected) *
            </Label>

            {/* Search Box */}
            <div className="relative mb-3">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search staff members by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            {/* Scrollable Staff List */}
            <ScrollArea className="flex-1 border border-white/10 rounded-md p-4 bg-white/[0.02]">
              <div className="space-y-3">
                {filteredStaffMembers.length > 0 ? (
                  filteredStaffMembers.map((staff) => (
                    <div key={staff.id} className="flex items-start space-x-3 pr-4">
                      <Checkbox
                        id={`staff-${staff.id}`}
                        checked={selectedStaffIds.includes(staff.id)}
                        onCheckedChange={() => toggleStaffSelection(staff.id)}
                        className="mt-1"
                      />
                      <label
                        htmlFor={`staff-${staff.id}`}
                        className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <p className="text-sm font-medium leading-none text-foreground">
                          {staff.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {staff.email}
                        </p>
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No staff members found
                  </p>
                )}
              </div>
            </ScrollArea>

            {errors.staffMembers && (
              <div className="flex items-center gap-2 text-xs text-red-500">
                <AlertCircleIcon className="size-3.5" />
                {errors.staffMembers}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-6 border-t border-white/10">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
            {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
            {initialData ? "Update Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
