"use client";

import type { JobDescriptionSheet } from "@/types/job-description-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cloneJobDescriptionTable,
  createEmptyJobDescriptionTable,
  JOB_DESCRIPTION_TABLE_COLS,
  JOB_DESCRIPTION_TABLE_ROWS,
  tablesAreEqual,
  type JobDescriptionTableData,
} from "@/lib/job-description-sheet-table";
import { cn } from "@/utils";
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { toast } from "sonner";

interface JobDescriptionSheetClientProps {
  sheet: JobDescriptionSheet | null;
  backHref: string;
  canManage: boolean;
  loadError?: string;
}

/**
 * Row highlight colors. Persisted alongside the sheet so that highlights
 * survive a save/reload cycle.
 *
 * NOTE: This assumes `JobDescriptionSheet` can carry an optional
 * `rowColors?: (string | null)[]` field, and that the
 * `PATCH /api/job-description-sheets/[id]` route accepts and persists a
 * `rowColors` value alongside `tableData`. If those don't exist yet, add
 * the field to the sheet type / database schema and have the API route
 * store + return it.
 */
type RowColor = "red" | "yellow" | "blue" | "green";

type JobDescriptionSheetWithRowColors = JobDescriptionSheet & {
  rowColors?: unknown;
};

const ROW_COLOR_VALUES: RowColor[] = ["red", "yellow", "blue", "green"];

const ROW_COLOR_OPTIONS: { value: RowColor; label: string }[] = [
  { value: "red", label: "On Hold" },
  { value: "yellow", label: "Yellow" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
];

const ROW_COLOR_ROW_STYLE: Record<RowColor, string> = {
  red: "rgba(239, 68, 68, 0.10)",
  yellow: "rgba(234, 179, 8, 0.10)",
  blue: "rgba(59, 130, 246, 0.10)",
  green: "rgba(34, 197, 94, 0.10)",
};

const ROW_COLOR_STICKY_STYLE: Record<RowColor, string> = {
  red: "rgba(72, 30, 30, 0.95)",
  yellow: "rgba(72, 62, 24, 0.95)",
  blue: "rgba(26, 44, 70, 0.95)",
  green: "rgba(26, 60, 40, 0.95)",
};

const STICKY_CELL_DEFAULT_STYLE = "rgba(23, 23, 23, 0.95)";

const ROW_COLOR_DOT_CLASSES: Record<RowColor, string> = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
};

const isRowColor = (value: unknown): value is RowColor =>
  typeof value === "string" && (ROW_COLOR_VALUES as string[]).includes(value);

const normalizeRowColors = (source: unknown, rowCount: number): (RowColor | null)[] => {
  const list = Array.isArray(source) ? source : [];
  return Array.from({ length: rowCount }, (_, index) =>
    isRowColor(list[index]) ? (list[index] as RowColor) : null,
  );
};

const rowColorsAreEqual = (a: (RowColor | null)[], b: (RowColor | null)[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const normalizeColumnWidths = (source: unknown, columnCount: number): number[] => {
  const list = Array.isArray(source) ? source : [];
  return Array.from({ length: columnCount }, (_, index) => {
    const val = list[index];
    return typeof val === "number" && val >= MIN_COLUMN_WIDTH ? val : DEFAULT_COLUMN_WIDTH;
  });
};

const columnWidthsAreEqual = (a: number[], b: number[]) =>
  a.length === b.length && a.every((value, index) => value === b[index]);

/**
 * Converts a zero-based column index into a spreadsheet-style label
 * (A, B, ..., Z, AA, AB, ...) so new columns continue the existing sequence.
 */
const getColumnLabel = (index: number): string => {
  let label = "";
  let current = index;
  do {
    label = String.fromCharCode(65 + (current % 26)) + label;
    current = Math.floor(current / 26) - 1;
  } while (current >= 0);
  return label;
};

const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

/**
 * Column-width resizing configuration.
 *
 * Widths are stored client-side only (not persisted to the sheet record).
 * Dragging the handle on the right edge of a header cell adjusts that
 * column's width; the "#" row-number column has a fixed width and is not
 * resizable.
 */
const ROW_NUMBER_COLUMN_WIDTH = 48;
const DEFAULT_COLUMN_WIDTH = 160;
const MIN_COLUMN_WIDTH = 80;

interface SheetCellProps {
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

const SheetCell = ({ value, isEditing, onChange }: SheetCellProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  }, [isEditing, value]);

  if (!isEditing) {
    return (
      <div className="min-h-[28px] whitespace-pre-wrap break-words text-sm">
        {value}
      </div>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
        adjustTextareaHeight(event.target);
      }}
      rows={1}
      className="min-h-[28px] w-full resize-none overflow-hidden rounded-md border border-violet-400/30 bg-violet-400/5 px-2 py-1.5 text-sm text-foreground outline-none ring-violet-400/40 transition focus:border-violet-400/50 focus:ring-2"
    />
  );
};

interface RowColorMenuProps {
  value: RowColor | null;
  onChange: (color: RowColor | null) => void;
}

const RowColorMenu = ({ value, onChange }: RowColorMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        aria-label="Set row color"
        className="flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground/70 transition hover:bg-white/10 hover:text-foreground"
      >
        <ChevronDownIcon className="size-3" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" className="min-w-[140px]">
      {ROW_COLOR_OPTIONS.map((option) => (
        <DropdownMenuItem
          key={option.value}
          onSelect={() => onChange(option.value)}
          className="gap-2"
        >
          <span className={cn("size-2.5 shrink-0 rounded-full", ROW_COLOR_DOT_CLASSES[option.value])} />
          <span className="flex-1">{option.label}</span>
          {value === option.value ? <CheckIcon className="size-3.5 text-muted-foreground" /> : null}
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={() => onChange(null)} disabled={!value} className="gap-2">
        <span className="size-2.5 shrink-0 rounded-full border border-white/20" />
        <span className="flex-1">No color</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const JobDescriptionSheetClient = ({
  sheet,
  backHref,
  canManage,
  loadError,
}: JobDescriptionSheetClientProps) => {
  const router = useRouter();
  const [savedTableData, setSavedTableData] = useState<JobDescriptionTableData>(() =>
    cloneJobDescriptionTable(sheet?.tableData ?? createEmptyJobDescriptionTable()),
  );
  const [draftTableData, setDraftTableData] = useState<JobDescriptionTableData>(() =>
    cloneJobDescriptionTable(sheet?.tableData ?? createEmptyJobDescriptionTable()),
  );
  const [savedRowColors, setSavedRowColors] = useState<(RowColor | null)[]>(() =>
    normalizeRowColors(
      (sheet as JobDescriptionSheetWithRowColors | null)?.rowColors,
      sheet?.tableData?.length ?? JOB_DESCRIPTION_TABLE_ROWS,
    ),
  );
  const [draftRowColors, setDraftRowColors] = useState<(RowColor | null)[]>(() =>
    normalizeRowColors(
      (sheet as JobDescriptionSheetWithRowColors | null)?.rowColors,
      sheet?.tableData?.length ?? JOB_DESCRIPTION_TABLE_ROWS,
    ),
  );
  const [savedColumnWidths, setSavedColumnWidths] = useState<number[]>(() =>
    normalizeColumnWidths(
      sheet?.columnWidths,
      sheet?.tableData?.[0]?.length ?? JOB_DESCRIPTION_TABLE_COLS,
    ),
  );
  const [draftColumnWidths, setDraftColumnWidths] = useState<number[]>(() =>
    normalizeColumnWidths(
      sheet?.columnWidths,
      sheet?.tableData?.[0]?.length ?? JOB_DESCRIPTION_TABLE_COLS,
    ),
  );
  const columnWidthsRef = useRef<number[]>(draftColumnWidths);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const pendingNavigationRef = useRef<(() => void) | null>(null);

  const isDirty =
    isEditMode &&
    (!tablesAreEqual(savedTableData, draftTableData) ||
      !rowColorsAreEqual(savedRowColors, draftRowColors) ||
      !columnWidthsAreEqual(savedColumnWidths, draftColumnWidths));

  useEffect(() => {
    if (!sheet) return;

    const nextTableData = cloneJobDescriptionTable(sheet.tableData);
    const nextRowColors = normalizeRowColors(
      sheet.rowColors,
      nextTableData.length,
    );
    const nextColumnWidths = normalizeColumnWidths(
      sheet.columnWidths,
      nextTableData[0]?.length ?? JOB_DESCRIPTION_TABLE_COLS,
    );

    setSavedTableData(nextTableData);
    setDraftTableData(nextTableData);
    setSavedRowColors(nextRowColors);
    setDraftRowColors(nextRowColors);
    setSavedColumnWidths(nextColumnWidths);
    setDraftColumnWidths(nextColumnWidths);
    setIsEditMode(false);
  }, [sheet]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const activeColumnWidths = isEditMode ? draftColumnWidths : savedColumnWidths;

  useEffect(() => {
    columnWidthsRef.current = activeColumnWidths;
  }, [activeColumnWidths]);

  const handleCellChange = useCallback((rowIndex: number, colIndex: number, value: string) => {
    setDraftTableData((previous) =>
      previous.map((row, currentRowIndex) =>
        currentRowIndex === rowIndex
          ? row.map((cell, currentColIndex) =>
            currentColIndex === colIndex ? value : cell,
          )
          : row,
      ),
    );
  }, []);

  const handleAddRow = useCallback(() => {
    setDraftTableData((previous) => {
      const columnCount = previous[0]?.length ?? JOB_DESCRIPTION_TABLE_COLS;
      const newRow = Array.from({ length: columnCount }, () => "");
      return [...previous, newRow];
    });
    setDraftRowColors((previous) => [...previous, null]);
  }, []);

  const handleInsertRow = useCallback((insertIndex: number) => {
    setDraftTableData((previous) => {
      const columnCount = previous[0]?.length ?? JOB_DESCRIPTION_TABLE_COLS;
      const newRow = Array.from({ length: columnCount }, () => "");
      const nextTable = [...previous];
      nextTable.splice(insertIndex, 0, newRow);
      return nextTable;
    });
    setDraftRowColors((previous) => {
      const nextColors = [...previous];
      nextColors.splice(insertIndex, 0, null);
      return nextColors;
    });
  }, []);

  const handleAddColumn = useCallback(() => {
    setDraftTableData((previous) => previous.map((row) => [...row, ""]));
    setDraftColumnWidths((previous) => [...previous, DEFAULT_COLUMN_WIDTH]);
  }, []);

  const handleRowColorChange = useCallback((rowIndex: number, color: RowColor | null) => {
    setDraftRowColors((previous) =>
      previous.map((existing, index) => (index === rowIndex ? color : existing)),
    );
  }, []);

  /**
   * Begins a column-resize drag. Triggered from a small handle rendered on
   * the right edge of each header cell (top row). Tracks pointer movement
   * on `window` until pointerup, updating only the targeted column's width.
   */
  const handleColumnResizeStart = useCallback(
    (colIndex: number) => (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = columnWidthsRef.current[colIndex] ?? DEFAULT_COLUMN_WIDTH;

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth = Math.max(MIN_COLUMN_WIDTH, Math.round(startWidth + delta));

        const setter = isEditMode ? setDraftColumnWidths : setSavedColumnWidths;
        setter((previous) =>
          previous.map((width, index) => (index === colIndex ? nextWidth : width)),
        );
      };

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [isEditMode],
  );

  const handleEdit = () => {
    setDraftTableData(cloneJobDescriptionTable(savedTableData));
    setDraftRowColors([...savedRowColors]);
    setDraftColumnWidths([...savedColumnWidths]);
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setDraftTableData(cloneJobDescriptionTable(savedTableData));
    setDraftRowColors([...savedRowColors]);
    setDraftColumnWidths([...savedColumnWidths]);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!sheet) return;

    setIsSaving(true);

    let response: Response;
    let data: {
      error?: string;
      message?: string;
      sheet?: JobDescriptionSheet;
    } = {};

    try {
      response = await fetch(`/api/job-description-sheets/${sheet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableData: draftTableData,
          rowColors: draftRowColors,
          columnWidths: draftColumnWidths,
        }),
      });

      data = await response.json().catch(() => ({}));
    } catch {
      setIsSaving(false);
      toast.error("Unable to reach the server. Please try again.");
      return;
    }

    setIsSaving(false);

    if (!response.ok) {
      toast.error(data.error ?? "Unable to save this sheet.");
      return;
    }

    const nextTableData = cloneJobDescriptionTable(
      data.sheet?.tableData ?? draftTableData,
    );
    const nextRowColors = normalizeRowColors(
      data.sheet?.rowColors ?? draftRowColors,
      nextTableData.length,
    );
    const nextColumnWidths = normalizeColumnWidths(
      data.sheet?.columnWidths ?? draftColumnWidths,
      nextTableData[0]?.length ?? JOB_DESCRIPTION_TABLE_COLS,
    );

    setSavedTableData(nextTableData);
    setDraftTableData(nextTableData);
    setSavedRowColors(nextRowColors);
    setDraftRowColors(nextRowColors);
    setSavedColumnWidths(nextColumnWidths);
    setDraftColumnWidths(nextColumnWidths);
    setIsEditMode(false);
    toast.success(data.message ?? "Sheet saved successfully.");
  };

  const requestNavigation = (navigate: () => void) => {
    if (isDirty) {
      pendingNavigationRef.current = navigate;
      setLeaveDialogOpen(true);
      return;
    }

    navigate();
  };

  const confirmLeave = () => {
    setDraftTableData(cloneJobDescriptionTable(savedTableData));
    setDraftRowColors([...savedRowColors]);
    setDraftColumnWidths([...savedColumnWidths]);
    setIsEditMode(false);
    pendingNavigationRef.current?.();
    pendingNavigationRef.current = null;
    setLeaveDialogOpen(false);
  };

  const cancelLeave = () => {
    pendingNavigationRef.current = null;
    setLeaveDialogOpen(false);
  };

  const activeTableData = isEditMode ? draftTableData : savedTableData;
  const activeRowColors = isEditMode ? draftRowColors : savedRowColors;
  const columnCount = activeTableData[0]?.length ?? JOB_DESCRIPTION_TABLE_COLS;
  const columnLabels = Array.from({ length: columnCount }, (_, index) => getColumnLabel(index));

  // Keep the column-widths array in sync with the current column count
  // (e.g. after a column is added via handleAddColumn or a different
  // sheet is loaded).
  useEffect(() => {
    const setter = isEditMode ? setDraftColumnWidths : setSavedColumnWidths;
    setter((previous) => {
      if (previous.length === columnCount) return previous;
      if (previous.length > columnCount) return previous.slice(0, columnCount);
      return [
        ...previous,
        ...Array.from({ length: columnCount - previous.length }, () => DEFAULT_COLUMN_WIDTH),
      ];
    });
  }, [columnCount, isEditMode]);

  const tableWidth =
    ROW_NUMBER_COLUMN_WIDTH +
    columnLabels.reduce((sum, _, index) => sum + (activeColumnWidths[index] ?? DEFAULT_COLUMN_WIDTH), 0);

  if (loadError) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Job Descriptions
        </Link>
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-sm text-amber-100 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-amber-300/30 bg-amber-300/10">
            <AlertTriangleIcon className="size-4" />
          </div>
          <div className="space-y-1">
            <h2 className="font-medium text-amber-50">Database connection unavailable</h2>
            <p className="leading-6 text-amber-100/80">{loadError}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!sheet) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <button
        type="button"
        onClick={() => requestNavigation(() => router.push(backHref))}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="size-4" />
        Back to Job Descriptions
      </button>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/60 to-neutral-950/60 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_42%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="w-fit border-violet-400/30 bg-violet-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-violet-200">
                Job description sheet
              </Badge>
              {isEditMode ? (
                <Badge variant="outline" className="w-fit border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-amber-200">
                  Edit mode
                </Badge>
              ) : null}
            </div>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                {sheet.companyName}
              </h1>
              <p className="text-sm leading-6 text-muted-foreground md:text-base">
                {sheet.typeOfRoles}
              </p>
            </div>
          </div>

          {canManage ? (
            <div className="flex flex-wrap items-center gap-2">
              {isEditMode ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="gap-2 border-white/10 bg-white/[0.03]"
                  >
                    <XIcon className="size-4" />
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !isDirty}
                    className="gap-2"
                  >
                    {isSaving ? (
                      <Loader2Icon className="size-4 animate-spin" />
                    ) : (
                      <SaveIcon className="size-4" />
                    )}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={handleEdit} className="gap-2">
                  <PencilIcon className="size-4" />
                  Edit Sheet
                </Button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {isEditMode ? (
        <div className="flex items-start gap-3 rounded-2xl border border-violet-400/30 bg-violet-400/10 px-4 py-3 text-sm text-violet-100">
          <PencilIcon className="mt-0.5 size-4 shrink-0 text-violet-200" />
          <p className="leading-6 text-violet-100/90">
            You are editing this sheet. Click cells to update content, then save your changes or cancel to discard them.
          </p>
        </div>
      ) : null}

      <div className="relative">
        <div
          className={cn(
            "overflow-hidden rounded-2xl border bg-neutral-900/30 shadow-lg backdrop-blur-md transition-colors",
            isEditMode
              ? "border-violet-400/40 ring-1 ring-violet-400/20"
              : "border-white/10",
          )}
        >
          <div className="overflow-x-auto">
            <table
              className="border-collapse text-sm"
              style={{ tableLayout: "fixed", width: tableWidth }}
            >
              <colgroup>
                <col style={{ width: ROW_NUMBER_COLUMN_WIDTH }} />
                {columnLabels.map((_, index) => (
                  <col key={index} style={{ width: activeColumnWidths[index] ?? DEFAULT_COLUMN_WIDTH }} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  <th className="sticky left-0 z-10 w-12 border-r border-white/10 bg-neutral-900/95 px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    #
                  </th>
                  {columnLabels.map((label, index) => (
                    <th
                      key={index}
                      className="group relative border-r border-white/10 px-3 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground last:border-r-0"
                    >
                      <span className="block truncate">{label}</span>
                      <div
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`Resize column ${label}`}
                        onPointerDown={handleColumnResizeStart(index)}
                        className="absolute right-0 top-0 z-20 h-full w-2 -translate-x-1/2 cursor-col-resize touch-none select-none rounded-full transition-colors hover:bg-violet-400/50 active:bg-violet-400/70"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTableData.map((row, rowIndex) => {
                  const rowColor = activeRowColors[rowIndex] ?? null;

                  return (
                    <tr
                      key={rowIndex}
                      className={cn(
                        "border-b border-white/5 transition-colors",
                        isEditMode ? "hover:bg-violet-400/[0.03]" : "hover:bg-white/[0.02]",
                        rowIndex === activeTableData.length - 1 && "border-b-0",
                      )}
                      style={rowColor ? { backgroundColor: ROW_COLOR_ROW_STYLE[rowColor] } : undefined}
                    >
                      <td
                        className="sticky left-0 z-10 border-r border-white/10 px-3 py-2 text-center text-xs font-medium text-muted-foreground"
                        style={{
                          backgroundColor: rowColor
                            ? ROW_COLOR_STICKY_STYLE[rowColor]
                            : STICKY_CELL_DEFAULT_STYLE,
                        }}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>{rowIndex + 1}</span>
                          {isEditMode ? (
                            <RowColorMenu
                              value={rowColor}
                              onChange={(color) => handleRowColorChange(rowIndex, color)}
                            />
                          ) : null}
                        </div>
                        {isEditMode && rowIndex < activeTableData.length - 1 ? (
                          <div
                            role="button"
                            aria-label={`Insert row after row ${rowIndex + 1}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInsertRow(rowIndex + 1);
                            }}
                            className="group absolute bottom-0 left-0 z-30 h-4 w-full translate-y-1/2 cursor-pointer select-none"
                          >
                            <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full transition-colors group-hover:bg-violet-400/40" />
                            <div className="absolute left-1/2 top-1/2 flex size-5 -translate-x-1/2 -translate-y-1/2 scale-0 items-center justify-center rounded-full border border-violet-400/40 bg-neutral-900 text-violet-200 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-150 group-hover:scale-100 hover:border-violet-400/60 hover:bg-violet-400/20 hover:text-violet-100">
                              <PlusIcon className="size-3" />
                            </div>
                          </div>
                        ) : null}
                      </td>
                      {row.map((cellValue, colIndex) => (
                        <td
                          key={colIndex}
                          className={cn(
                            "overflow-hidden border-r border-white/5 px-2 py-1.5 text-foreground last:border-r-0",
                            isEditMode && "bg-violet-400/[0.02]",
                          )}
                        >
                          <SheetCell
                            isEditing={isEditMode}
                            value={cellValue ?? ""}
                            onChange={(value) => handleCellChange(rowIndex, colIndex, value)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {isEditMode && canManage ? (
          <button
            type="button"
            onClick={handleAddRow}
            aria-label="Add row"
            className="absolute -bottom-4 left-1/2 z-20 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border border-violet-400/40 bg-neutral-900 text-violet-200 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition hover:border-violet-400/60 hover:bg-violet-400/10 hover:text-violet-100"
          >
            <PlusIcon className="size-4" />
          </button>
        ) : null}

        {isEditMode && canManage ? (
          <button
            type="button"
            onClick={handleAddColumn}
            aria-label="Add column"
            className="absolute right-0 top-1/2 z-20 flex size-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-violet-400/40 bg-neutral-900 text-violet-200 shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition hover:border-violet-400/60 hover:bg-violet-400/10 hover:text-violet-100"
          >
            <PlusIcon className="size-4" />
          </button>
        ) : null}
      </div>

      <Dialog open={leaveDialogOpen} onOpenChange={(open) => { if (!open) cancelLeave(); }}>
        <DialogContent className="border-border/80 bg-neutral-950 sm:max-w-md sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle>Discard unsaved changes?</DialogTitle>
            <DialogDescription>
              You have unsaved edits on this sheet. Leaving now will restore the last saved version.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={cancelLeave}>
              Keep Editing
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={confirmLeave}
            >
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobDescriptionSheetClient;
