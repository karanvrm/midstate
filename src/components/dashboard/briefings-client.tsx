"use client";

import type { Briefing, BriefingFileInput, BriefingLinkInput } from "@/types/briefing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";
import {
  AlertTriangleIcon,
  ArrowUpRightIcon,
  BookOpenTextIcon,
  FileIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface BriefingsClientProps {
  briefings: Briefing[];
  canManage: boolean;
  loadError?: string;
}

interface BriefingFormState {
  companyName: string;
  briefingText: string;
  links: BriefingLinkInput[];
  files: BriefingFileInput[];
  pendingFiles: File[];
}

const emptyForm: BriefingFormState = {
  companyName: "",
  briefingText: "",
  links: [],
  files: [],
  pendingFiles: [],
};

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

const BriefingsClient = ({ briefings, canManage, loadError }: BriefingsClientProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingBriefing, setEditingBriefing] = useState<Briefing | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<BriefingFormState>(emptyForm);

  const formTitle = editingBriefing ? "Edit Briefing" : "Add Briefing";
  const isEditing = Boolean(editingBriefing);

  const selectedFileNames = useMemo(
    () => form.pendingFiles.map((file) => file.name).join(", "),
    [form.pendingFiles],
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingBriefing(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCreateDialog = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditDialog = (briefing: Briefing) => {
    setEditingBriefing(briefing);
    setForm({
      companyName: briefing.companyName,
      briefingText: briefing.briefingText,
      links: briefing.links.map((link) => ({ title: link.title, url: link.url })),
      files: briefing.files.map((file) => ({ fileName: file.fileName, fileUrl: file.fileUrl })),
      pendingFiles: [],
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);

    if (!open) {
      resetForm();
    }
  };

  const updateLink = (index: number, field: keyof BriefingLinkInput, value: string) => {
    setForm((current) => ({
      ...current,
      links: current.links.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link,
      ),
    }));
  };

  const removeLink = (index: number) => {
    setForm((current) => ({
      ...current,
      links: current.links.filter((_, linkIndex) => linkIndex !== index),
    }));
  };

  const removeExistingFile = (index: number) => {
    setForm((current) => ({
      ...current,
      files: current.files.filter((_, fileIndex) => fileIndex !== index),
    }));
  };

  const removePendingFile = (index: number) => {
    setForm((current) => ({
      ...current,
      pendingFiles: current.pendingFiles.filter((_, fileIndex) => fileIndex !== index),
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);

    if (!nextFiles.length) {
      return;
    }

    setForm((current) => ({
      ...current,
      pendingFiles: [...current.pendingFiles, ...nextFiles],
    }));

    event.target.value = "";
  };

  const uploadPendingFiles = async () => {
    if (!form.pendingFiles.length) {
      return [];
    }

    const payload = new FormData();
    form.pendingFiles.forEach((file) => payload.append("files", file));

    const response = await fetch("/api/briefing-files", {
      method: "POST",
      body: payload,
    });
    const data: { files?: BriefingFileInput[]; error?: string } = await response
      .json()
      .catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error ?? "Unable to upload files.");
    }

    return data.files ?? [];
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const companyName = form.companyName.trim();
    const briefingText = form.briefingText.trim();
    const links = form.links.map((link) => ({
      title: link.title.trim(),
      url: link.url.trim(),
    }));

    if (!companyName) {
      setError("Company name is required.");
      return;
    }

    if (!briefingText) {
      setError("Briefing text is required.");
      return;
    }

    const incompleteLink = links.find((link) => !link.title || !link.url);

    if (incompleteLink) {
      setError("Each link needs a title and URL.");
      return;
    }

    const invalidLink = links.find((link) => !isValidUrl(link.url));

    if (invalidLink) {
      setError("Enter a valid URL for each link.");
      return;
    }

    setIsSaving(true);

    let response: Response;
    let data: { error?: string; message?: string } = {};

    try {
      const uploadedFiles = await uploadPendingFiles();
      const files = [...form.files, ...uploadedFiles];

      response = await fetch(isEditing ? `/api/briefings/${editingBriefing?.id}` : "/api/briefings", {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          briefingText,
          links,
          files,
        }),
      });

      data = await response.json().catch(() => ({}));
    } catch (saveError) {
      setIsSaving(false);
      setError(saveError instanceof Error ? saveError.message : "Unable to reach the server. Please try again.");
      return;
    }

    setIsSaving(false);

    if (!response.ok) {
      setError(data.error ?? "Unable to save this briefing.");
      return;
    }

    toast.success(data.message ?? "Briefing saved successfully.");
    handleFormOpenChange(false);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">
              Company briefings
            </Badge>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                Briefing
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Store company briefing notes, reference links, and supporting files for the internal team.
              </p>
            </div>
          </div>

          {canManage ? (
            <Button onClick={openCreateDialog} className="w-full gap-2 md:w-auto">
              <PlusIcon className="size-4" />
              Add Briefing
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
        {briefings.length ? (
          briefings.map((briefing) => (
            <Card
              key={briefing.id}
              className="group relative overflow-hidden rounded-2xl border-white/10 bg-neutral-900/30 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-cyan-500/5 opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              <CardHeader className="relative border-b border-white/5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <BookOpenTextIcon className="size-5 text-violet-300" />
                  </div>
                  <Badge variant="outline" className="border-white/10 bg-white/[0.02] text-[10px] uppercase text-muted-foreground">
                    Added {formatDate(briefing.createdAt)}
                  </Badge>
                </div>
                <CardTitle className="mt-4 line-clamp-2 text-xl font-medium text-foreground">
                  {briefing.companyName}
                </CardTitle>
              </CardHeader>
              <CardContent className="relative flex items-center justify-end gap-2 pt-5">
                {canManage ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2 border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"
                    onClick={() => openEditDialog(briefing)}
                  >
                    <PencilIcon className="size-3.5" />
                    Edit
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2 border-violet-400/30 bg-violet-400/10 text-violet-100 hover:bg-violet-400/20 hover:text-white"
                  onClick={() => router.push(`/briefing/${briefing.id}`)}
                >
                  Open
                  <ArrowUpRightIcon className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-border/70 bg-card/80 px-6 py-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background/80">
              <BookOpenTextIcon className="size-5 text-violet-300" />
            </div>
            <h2 className="text-lg font-medium text-foreground">No briefings yet</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              {canManage
                ? "Add the first company briefing so the team can review it here."
                : "Company briefings will appear here when an admin adds them."}
            </p>
          </div>
        )}
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleFormOpenChange}>
        <DialogContent className="max-h-[88vh] overflow-y-auto border-border/80 bg-neutral-950 sm:max-w-3xl sm:rounded-2xl">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>{formTitle}</DialogTitle>
              <DialogDescription>
                Add the company briefing text, reference links, and supporting files.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="briefing-company">Company Name</Label>
                <Input
                  id="briefing-company"
                  value={form.companyName}
                  onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))}
                  placeholder="Company name"
                  className="border-white/10 bg-white/[0.03]"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="briefing-text">Briefing Text</Label>
                <Textarea
                  id="briefing-text"
                  value={form.briefingText}
                  onChange={(event) => setForm((current) => ({ ...current, briefingText: event.target.value }))}
                  placeholder="Write the company briefing..."
                  className="min-h-40 border-white/10 bg-white/[0.03]"
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Links</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2 border-white/10 bg-white/[0.03]"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        links: [...current.links, { title: "", url: "" }],
                      }))
                    }
                    disabled={isSaving}
                  >
                    <PlusIcon className="size-3.5" />
                    Add Link
                  </Button>
                </div>

                <div className="space-y-3">
                  {form.links.map((link, index) => (
                    <div key={index} className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 md:grid-cols-[1fr_1fr_auto]">
                      <Input
                        value={link.title}
                        onChange={(event) => updateLink(index, "title", event.target.value)}
                        placeholder="Link title"
                        className="border-white/10 bg-white/[0.03]"
                        disabled={isSaving}
                      />
                      <Input
                        value={link.url}
                        onChange={(event) => updateLink(index, "url", event.target.value)}
                        placeholder="https://example.com"
                        className="border-white/10 bg-white/[0.03]"
                        disabled={isSaving}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="border-red-500/30 text-red-200 hover:bg-red-500/10 hover:text-red-100"
                        onClick={() => removeLink(index)}
                        disabled={isSaving}
                        aria-label="Remove link"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Files</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2 border-white/10 bg-white/[0.03]"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSaving}
                  >
                    <UploadIcon className="size-3.5" />
                    Upload Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>

                {selectedFileNames ? (
                  <p className="text-xs text-muted-foreground">{selectedFileNames}</p>
                ) : null}

                <div className="space-y-2">
                  {form.files.map((file, index) => (
                    <div key={`${file.fileUrl}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                        <FileIcon className="size-4 shrink-0 text-violet-300" />
                        <span className="truncate">{file.fileName}</span>
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8 text-red-200 hover:bg-red-500/10 hover:text-red-100"
                        onClick={() => removeExistingFile(index)}
                        disabled={isSaving}
                        aria-label="Remove file"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  ))}

                  {form.pendingFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                      <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
                        <UploadIcon className="size-4 shrink-0 text-violet-300" />
                        <span className="truncate">{file.name}</span>
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8 text-red-200 hover:bg-red-500/10 hover:text-red-100"
                        onClick={() => removePendingFile(index)}
                        disabled={isSaving}
                        aria-label="Remove selected file"
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
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
                onClick={() => handleFormOpenChange(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className={cn("gap-2")}>
                {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : null}
                {isEditing ? "Save Briefing" : "Create Briefing"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BriefingsClient;
