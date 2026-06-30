"use client";

import * as React from "react";
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
import { parseXlsxFile } from "@/lib/parseXlsx";
import type { ParsedXlsx } from "@/types/tasks";
import { toast } from "sonner";
import { cn } from "@/utils";
import {
  Loader2Icon,
  SearchIcon,
  AlertCircleIcon,
  UploadIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  email: string;
}

interface CreateEditTaskModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    assignedStaffIds: string[];
    candidates?: any[];
    selectedColumns?: string[];
  }) => void;
  staffMembers: StaffMember[];
  initialData?: {
    id: string;
    name: string;
    assignedStaff: StaffMember[];
  };
}

const KNOWN_COLUMNS = [
  "Name",
  "Email ID",
  "Phone Number",
  "Current Location",
  "Preferred Locations",
  "Total Experience",
  "Under Graduation degree",
];

export function CreateEditTaskModal({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
  staffMembers,
  initialData,
}: CreateEditTaskModalProps) {
  // Wizard flow states
  const [step, setStep] = useState<number>(1);
  const [taskName, setTaskName] = useState("");
  
  // Excel upload states
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedXlsx | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  
  // Staff assignment state
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset modal when opened/closed or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTaskName(initialData.name);
        setSelectedStaffId(initialData.assignedStaff[0]?.id || "");
        setStep(1);
      } else {
        setTaskName("");
        setFile(null);
        setParsedData(null);
        setSelectedColumns([]);
        setSelectedStaffId("");
        setStep(1);
      }
      setSearchQuery("");
      setErrors({});
    }
  }, [initialData, isOpen]);

  // Handle file drop/browse
  const processFile = async (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
      setErrors({ file: "Please upload an .xlsx or .xls file" });
      return;
    }
    setFile(selectedFile);
    setParsing(true);
    setErrors({});
    try {
      const data = await parseXlsxFile(selectedFile);
      setParsedData(data);
      // Pre-select known columns
      const cols = data.columns.filter((c) => KNOWN_COLUMNS.includes(c));
      setSelectedColumns(cols);
      setStep(3);
    } catch (err) {
      console.error(err);
      setErrors({ file: "Failed to parse file. Make sure it is a valid Excel file." });
    } finally {
      setParsing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  // Toggle checkbox columns
  const toggleColumn = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  // Staff members filter
  const filteredStaffMembers = useMemo(() => {
    if (!searchQuery) return staffMembers;
    const query = searchQuery.toLowerCase();
    return staffMembers.filter(
      (staff) =>
        staff.name.toLowerCase().includes(query) ||
        staff.email.toLowerCase().includes(query)
    );
  }, [staffMembers, searchQuery]);

  // Submit action
  const handleAssign = () => {
    if (!selectedStaffId) {
      setErrors({ staff: "Please select a staff member to assign." });
      return;
    }

    onSubmit({
      name: taskName.trim(),
      assignedStaffIds: [selectedStaffId],
      candidates: parsedData?.rows || [],
      selectedColumns,
    });
  };

  const handleUpdate = () => {
    if (!taskName.trim()) {
      setErrors({ name: "Task name is required" });
      return;
    }
    if (!selectedStaffId) {
      setErrors({ staff: "Please select a staff member to assign." });
      return;
    }

    onSubmit({
      name: taskName.trim(),
      assignedStaffIds: [selectedStaffId],
    });
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleNextStep2 = () => {
    if (!taskName.trim()) {
      setErrors({ name: "Task name is required" });
    } else {
      setStep(2);
    }
  };

  const handleNextStep3 = () => {
    setStep(3);
  };

  const handleNextStep4 = () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to import.");
    } else {
      setStep(4);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {initialData ? (
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col border border-white/10 bg-neutral-950/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Edit Task Assignment</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Modify task details and update the assigned staff member.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 pr-1">
            <div className="space-y-2">
              <Label htmlFor="edit-task-name" className="text-sm font-medium">Task Name *</Label>
              <Input
                id="edit-task-name"
                value={taskName}
                onChange={(e) => {
                  setTaskName(e.target.value);
                  setErrors({});
                }}
                className={errors.name ? "border-red-500 bg-white/5" : "bg-white/5"}
              />
              {errors.name && (
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircleIcon className="size-3.5" />
                  {errors.name}
                </div>
              )}
            </div>

            <div className="space-y-3 flex flex-col min-h-[250px]">
              <Label className="text-sm font-medium">Assign Staff Member *</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm bg-white/5"
                />
              </div>

              <ScrollArea className="flex-1 border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                <div className="space-y-2.5">
                  {filteredStaffMembers.length > 0 ? (
                    filteredStaffMembers.map((staff) => (
                      <div
                        key={staff.id}
                        onClick={() => setSelectedStaffId(staff.id)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                          selectedStaffId === staff.id
                            ? "border-violet-500 bg-violet-500/10 text-violet-200"
                            : "border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-foreground"
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium">{staff.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{staff.email}</p>
                        </div>
                        <div className={cn(
                          "size-5 rounded-full border flex items-center justify-center",
                          selectedStaffId === staff.id
                            ? "border-violet-500 bg-violet-500"
                            : "border-white/20"
                        )}>
                          {selectedStaffId === staff.id && (
                            <span className="size-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No staff members found</p>
                  )}
                </div>
              </ScrollArea>
              {errors.staff && (
                <div className="flex items-center gap-1 text-xs text-red-400">
                  <AlertCircleIcon className="size-3.5" />
                  {errors.staff}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-6 border-t border-white/10">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading} className="bg-violet-600 hover:bg-violet-500 text-white gap-2">
              {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col border border-white/10 bg-neutral-950/95 backdrop-blur-md shadow-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div>
                <DialogTitle className="text-2xl font-semibold">Assign Task</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Unified wizard to configure task details, upload candidate list, and assign staff.
                </DialogDescription>
              </div>
              {/* Step Indicators */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={cn(
                      "size-6 rounded-full flex items-center justify-center text-xs font-semibold border transition-all",
                      step === num
                        ? "border-violet-500 bg-violet-600 text-white"
                        : step > num
                        ? "border-violet-900 bg-violet-900/40 text-violet-300"
                        : "border-white/10 bg-white/5 text-muted-foreground"
                    )}
                  >
                    {step > num ? "✓" : num}
                  </div>
                ))}
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4 pr-1">
            {/* Step 1: Task Name */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="task-name" className="text-base font-medium">1. Enter Task Name</Label>
                  <p className="text-xs text-muted-foreground">Give this assignment a distinct descriptive title.</p>
                  <Input
                    id="task-name"
                    placeholder="e.g. Technical Support Candidates - Q3"
                    value={taskName}
                    onChange={(e) => {
                      setTaskName(e.target.value);
                      setErrors({});
                    }}
                    className={cn("bg-white/5 h-11 text-base", errors.name && "border-red-500")}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircleIcon className="size-3.5" />
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Upload Excel File */}
            {step === 2 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">2. Upload Candidate Excel List</Label>
                <p className="text-xs text-muted-foreground">Upload a .xlsx or .xls Naukri export format candidates file.</p>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-14 transition-all duration-300",
                    dragging
                      ? "border-violet-400 bg-violet-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                      : "border-white/10 bg-white/[0.01] hover:border-white/20"
                  )}
                >
                  {parsing ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="w-8 h-8 animate-spin text-violet-400" />
                      <p className="text-sm text-muted-foreground">Parsing candidate file data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 rounded-full border border-white/5 bg-white/[0.03] text-violet-300">
                        <UploadIcon className="size-8 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">Drag & drop your Excel file here</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports XLSX, XLS files only</p>
                      </div>
                      <label className="cursor-pointer rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition-colors hover:bg-violet-500/20">
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) processFile(f);
                          }}
                        />
                        Browse File
                      </label>
                    </>
                  )}
                </div>
                {errors.file && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircleIcon className="size-3.5" />
                    {errors.file}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Column Selection & Preview */}
            {step === 3 && parsedData && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-base font-medium">3. Column Mapping & Preview</Label>
                  <p className="text-xs text-muted-foreground">Check the columns you wish to import from the spreadsheet. Live preview updates below.</p>
                </div>

                {/* Column Selection */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Columns to Import</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {parsedData.columns.map((col) => (
                      <label
                        key={col}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all",
                          selectedColumns.includes(col)
                            ? "border-violet-500 bg-violet-500/5 text-violet-200"
                            : "border-white/5 bg-white/[0.01] text-muted-foreground hover:border-white/10"
                        )}
                      >
                        <Checkbox
                          checked={selectedColumns.includes(col)}
                          onCheckedChange={() => toggleColumn(col)}
                        />
                        <span className="text-xs truncate font-medium">{col}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Live Preview Table */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Preview ({Math.min(5, parsedData.rows.length)} of {parsedData.rows.length} rows)
                  </p>
                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/[0.01]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.03]">
                          {selectedColumns.map((c) => (
                            <th key={c} className="px-4 py-3 text-left font-medium text-muted-foreground">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {parsedData.rows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            {selectedColumns.map((c) => (
                              <td key={c} className="px-4 py-2.5 text-muted-foreground truncate max-w-[150px]">
                                {row[c] || "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Select Staff Member */}
            {step === 4 && (
              <div className="space-y-4 flex flex-col min-h-[300px]">
                <div className="space-y-1">
                  <Label className="text-base font-medium">4. Assign Staff Member</Label>
                  <p className="text-xs text-muted-foreground">Select the staff member who will coordinate and process this task&apos;s candidates.</p>
                </div>

                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search staff members by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-sm bg-white/5"
                  />
                </div>

                <ScrollArea className="flex-1 border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                  <div className="space-y-2">
                    {filteredStaffMembers.length > 0 ? (
                      filteredStaffMembers.map((staff) => (
                        <div
                          key={staff.id}
                          onClick={() => {
                            setSelectedStaffId(staff.id);
                            setErrors({});
                          }}
                          className={cn(
                            "flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all",
                            selectedStaffId === staff.id
                              ? "border-violet-500 bg-violet-500/10 text-violet-200"
                              : "border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-foreground"
                          )}
                        >
                          <div>
                            <p className="text-sm font-medium">{staff.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{staff.email}</p>
                          </div>
                          <div className={cn(
                            "size-5 rounded-full border flex items-center justify-center",
                            selectedStaffId === staff.id
                              ? "border-violet-500 bg-violet-500"
                              : "border-white/20"
                          )}>
                            {selectedStaffId === staff.id && (
                              <span className="size-2 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">No staff members found</p>
                    )}
                  </div>
                </ScrollArea>
                {errors.staff && (
                  <div className="flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircleIcon className="size-3.5" />
                    {errors.staff}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center justify-between gap-3 pt-6 border-t border-white/10">
            <div>
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="gap-1.5 border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground"
                >
                  <ArrowLeftIcon className="size-4" />
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
              {step === 1 && (
                <Button
                  onClick={handleNextStep2}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5"
                >
                  Next
                  <ArrowRightIcon className="size-4" />
                </Button>
              )}
              {step === 2 && file && (
                <Button
                  onClick={handleNextStep3}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5"
                >
                  Next
                  <ArrowRightIcon className="size-4" />
                </Button>
              )}
              {step === 3 && (
                <Button
                  onClick={handleNextStep4}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5"
                >
                  Next
                  <ArrowRightIcon className="size-4" />
                </Button>
              )}
              {step === 4 && (
                <Button
                  onClick={handleAssign}
                  disabled={isLoading || !selectedStaffId}
                  className="bg-violet-600 hover:bg-violet-500 text-white gap-1.5"
                >
                  {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
                  Assign Task
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
