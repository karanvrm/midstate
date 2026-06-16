"use client";

import type { JobDescriptionSheetSummary } from "@/types/job-description-sheet";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  FileTextIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface JobDescriptionsClientProps {
  sheets: JobDescriptionSheetSummary[];
  canManage: boolean;
  sheetBasePath: string;
  sheetOpenQuery?: string;
  loadError?: string;
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const JobDescriptionsClient = ({
  sheets,
  canManage,
  sheetBasePath,
  sheetOpenQuery = "",
  loadError,
}: JobDescriptionsClientProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [typeOfRoles, setTypeOfRoles] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deletingSheet, setDeletingSheet] = useState<JobDescriptionSheetSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetForm = () => {
    setCompanyName("");
    setTypeOfRoles("");
    setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      resetForm();
    }
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const trimmedCompanyName = companyName.trim();
    const trimmedTypeOfRoles = typeOfRoles.trim();

    if (!trimmedCompanyName) {
      setError("Company name is required.");
      return;
    }

    if (!trimmedTypeOfRoles) {
      setError("Type of roles is required.");
      return;
    }

    setIsSaving(true);

    let response: Response;
    let data: { error?: string; message?: string } = {};

    try {
      response = await fetch("/api/job-description-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: trimmedCompanyName,
          typeOfRoles: trimmedTypeOfRoles,
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
      setError(data.error ?? "Unable to create this sheet.");
      return;
    }

    toast.success(data.message ?? "Sheet created successfully.");
    handleOpenChange(false);
    router.refresh();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSheet) return;

    setIsDeleting(true);

    let response: Response;
    let data: { error?: string; message?: string } = {};

    try {
      response = await fetch(`/api/job-description-sheets/${deletingSheet.id}`, {
        method: "DELETE",
      });

      data = await response.json().catch(() => ({}));
    } catch {
      setIsDeleting(false);
      toast.error("Unable to reach the server. Please try again.");
      return;
    }

    setIsDeleting(false);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to delete this sheet.");
      return;
    }

    toast.success(data.message ?? "Sheet deleted successfully.");
    setDeletingSheet(null);
    router.refresh();
  };

  const openSheet = (sheetId: string) => {
    router.push(`${sheetBasePath}/${sheetId}${sheetOpenQuery}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">
              Recruiter sheets
            </Badge>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                Job Descriptions
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Create and manage job description sheets for each company and role type.
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
                    <FileTextIcon className="size-5 text-violet-300" />
                  </div>
                  {canManage ? (
                    <Badge variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] uppercase text-muted-foreground">
                      Created {formatDate(sheet.createdAt)}
                    </Badge>
                  ) : null}
                </div>
                <CardTitle className="mt-4 line-clamp-2 text-xl font-medium text-foreground">
                  {sheet.companyName}
                </CardTitle>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {sheet.typeOfRoles}
                </p>
              </CardHeader>
              <CardContent className="relative pt-5">
                <div className="flex items-center justify-between gap-4">
                  {canManage ? (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8 shrink-0 text-red-400/70 hover:bg-red-500/15 hover:text-red-400"
                      onClick={() => setDeletingSheet(sheet)}
                      aria-label="Delete job description sheet"
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  ) : (
                    <div className="text-xs text-muted-foreground">Job description sheet</div>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2 border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 hover:text-white"
                    onClick={() => openSheet(sheet.id)}
                  >
                    Open Sheet
                    <ArrowUpRightIcon className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/80 px-6 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background/80">
              <FileTextIcon className="size-5 text-violet-300" />
            </div>
            <h2 className="text-lg font-medium text-foreground">No sheets yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {canManage
                ? "Create the first job description sheet to get started."
                : "Available job description sheets will appear here when an admin adds them."}
            </p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="border-border/80 bg-neutral-950 sm:rounded-2xl">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Add Sheet</DialogTitle>
              <DialogDescription>
                Create a new job description sheet with an empty spreadsheet table.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="TELUS"
                  className="border-white/10 bg-white/[0.03]"
                  disabled={isSaving}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type-of-roles">Type of Roles</Label>
                <Input
                  id="type-of-roles"
                  value={typeOfRoles}
                  onChange={(event) => setTypeOfRoles(event.target.value)}
                  placeholder="Customer Service, Sales"
                  className="border-white/10 bg-white/[0.03]"
                  disabled={isSaving}
                />
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deletingSheet)} onOpenChange={(open) => { if (!open && !isDeleting) setDeletingSheet(null); }}>
        <DialogContent className="border-border/80 bg-neutral-950 sm:max-w-md sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Job Description</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingSheet?.companyName || "this sheet"}&quot;?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeletingSheet(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              className="gap-2 bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? <Loader2Icon className="size-4 animate-spin" /> : <Trash2Icon className="size-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDescriptionsClient;
