"use client";

import type { AttendanceSheet } from "@/types/attendance-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  CalendarIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface AttendancesClientProps {
  sheets: AttendanceSheet[];
  canManage: boolean;
  loadError?: string;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

const AttendancesClient = ({ sheets, canManage, loadError }: AttendancesClientProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [sheetToDelete, setSheetToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetForm = () => {
    setMonth("");
    setYear("");
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      resetForm();
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!month || !year) {
      setError("Please select both month and year.");
      return;
    }

    setIsSaving(true);

    const sheetName = `${month} ${year}`;
    const dummyUrl = `https://example.com/sheet-${month.toLowerCase()}-${year}`;

    let response: Response;
    let data: { error?: string; message?: string } = {};

    try {
      response = await fetch("/api/attendance-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: sheetName,
          url: dummyUrl,
        }),
      });

      data = await response.json().catch(() => ({}));
    } catch {
      setIsSaving(false);
      setError("Unable to reach the server. Please try again.");
      return;
    }

    setIsSaving(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to save this sheet.");
      return;
    }

    toast.success(data.message ?? "Sheet saved successfully.");
    handleOpenChange(false);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!sheetToDelete) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/attendance-sheets/${sheetToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete sheet.");
      }

      toast.success("Sheet deleted successfully.");
      setSheetToDelete(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">
              Attendance tracking
            </Badge>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                Attendance Sheets
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Manage Google Sheets used for employee attendance records.
              </p>
            </div>
          </div>

          {canManage ? (
            <Button onClick={() => setIsOpen(true)} className="w-full gap-2 md:w-auto">
              <PlusIcon className="size-4" />
              Add Sheet
            </Button>
          ) : null}
        </div>
      </div>

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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sheets.length ? (
          sheets.map((sheet) => (
            <Card
              key={sheet.id}
              className="group relative overflow-hidden rounded-2xl border-white/10 bg-neutral-900/30 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative border-b border-white/5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <CalendarIcon className="size-5 text-violet-300" />
                  </div>
                  {canManage ? (
                    <Badge variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] uppercase text-muted-foreground">
                      Created {formatDate(sheet.createdAt)}
                    </Badge>
                  ) : null}
                </div>
                <CardTitle className="mt-4 line-clamp-2 text-xl font-medium text-foreground">
                  {sheet.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex items-center justify-between gap-4 pt-5">
                {canManage ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    onClick={() => setSheetToDelete(sheet.id)}
                  >
                    <Trash2Icon className="size-4" />
                    Delete
                  </Button>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    Google Sheet
                  </div>
                )}
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2 border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 hover:text-white"
                    onClick={() => router.push(`/dashboard/owner/attendance/${sheet.id}`)}
                  >
                    Open
                    <ArrowUpRightIcon className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/80 px-6 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background/80">
              <CalendarIcon className="size-5 text-violet-300" />
            </div>
            <h2 className="text-lg font-medium text-foreground">No sheets yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {canManage
                ? "Add the first Google Sheet link so employees can access attendance records quickly."
                : "Available attendance sheets will appear here when an admin adds them."}
            </p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="border-border/80 bg-neutral-950 sm:rounded-2xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>Add Sheet</DialogTitle>
              <DialogDescription>
                Store a Google Sheet link for employee attendance records.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label>Month</Label>
                <Select value={month} onValueChange={setMonth} disabled={isSaving}>
                  <SelectTrigger className="border-white/10 bg-white/[0.03]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m) => (
                      <SelectItem key={m} value={m}>
                         {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={year} onValueChange={setYear} disabled={isSaving}>
                  <SelectTrigger className="border-white/10 bg-white/[0.03]">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </div>

            <DialogFooter className="mt-6 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className={cn("gap-2")}>
                {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                Save Sheet
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!sheetToDelete} onOpenChange={(open) => !open && setSheetToDelete(null)}>
        <AlertDialogContent className="border-border/80 bg-neutral-950 sm:rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this attendance sheet and remove all associated daily records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? <Loader2Icon className="size-4 animate-spin" /> : null}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AttendancesClient;
