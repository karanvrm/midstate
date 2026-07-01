"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PlacementRecord {
  id: string;
  name: string;
  phoneNumber: string;
  companyName: string;
  positionPost: string;
  selectionDate: string | null;
  tenureCompleted: boolean;
}

interface PlacementsClientProps {
  placements: PlacementRecord[];
  canEditTenure: boolean;
}

interface MonthOption {
  value: string;
  label: string;
}

const formatSelectedOn = (selectionDate: string | null) => {
  if (!selectionDate) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(selectionDate));
};

const getMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    year: "numeric",
  }).format(date);

const getMonthStart = (monthKey: string) => {
  const [year, month] = monthKey.split("-").map(Number);
  return new Date(year, month - 1, 1);
};

export default function PlacementsClient({ placements, canEditTenure }: PlacementsClientProps) {
  const router = useRouter();
  const [rows, setRows] = useState(placements);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const currentMonthKey = getMonthKey(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);

  const monthOptions = useMemo<MonthOption[]>(() => {
    const monthMap = new Map<string, MonthOption>();

    monthMap.set(currentMonthKey, {
      value: currentMonthKey,
      label: getMonthLabel(getMonthStart(currentMonthKey)),
    });

      rows.forEach((placement) => {
      if (!placement.selectionDate) {
        return;
      }

      const selectedDate = new Date(placement.selectionDate);
      const monthKey = getMonthKey(selectedDate);

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          value: monthKey,
          label: getMonthLabel(selectedDate),
        });
      }
    });

return Array.from(monthMap.values()).sort((left, right) => right.value.localeCompare(left.value));  }, [currentMonthKey, rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((placement) => {
      if (!placement.selectionDate) {
        return false;
      }

      return getMonthKey(new Date(placement.selectionDate)) === selectedMonth;
    });
  }, [rows, selectedMonth]);

  const handleTenureToggle = async (placementId: string, tenureCompleted: boolean) => {
    const previousRows = rows;
    setPendingId(placementId);
    setMessage(null);
    setRows((currentRows) =>
      currentRows.map((candidate) =>
        candidate.id === placementId ? { ...candidate, tenureCompleted } : candidate
      )
    );

    try {
      const response = await fetch(`/api/candidates/${placementId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tenureCompleted }),
      });

      const data = await response.json().catch(() => null);
      setPendingId(null);

      if (!response.ok) {
        setRows(previousRows);
        setMessage({
          type: "error",
          text: data?.error ?? "Unable to update tenure completion.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: data?.message ?? "Tenure completion updated successfully.",
      });
      router.refresh();
    } catch {
      setPendingId(null);
      setRows(previousRows);
      setMessage({
        type: "error",
        text: "An error occurred while updating tenure completion.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={
            message.type === "success"
              ? "rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
              : "rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-red-200"
          }
          role="status"
        >
          {message.text}
        </div>
      )}

      <Card className="border-white/10 bg-neutral-900/40 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-white/5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <CardTitle className="text-lg font-medium text-foreground md:text-xl">
                Placements
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Successfully selected candidates only. Tenure completion can be updated by Admin users.
              </CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:items-end">
              <div className="flex items-center gap-2 md:justify-end">
                <Badge variant="outline" className="w-fit border-violet-400/30 bg-violet-400/10 text-violet-200">
                  {filteredRows.length} records
                </Badge>
              </div>
              <div className="w-full md:w-56">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="border-white/10 bg-background/80 text-sm text-foreground">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredRows.length ? (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="whitespace-nowrap">Candidate Name</TableHead>
                  <TableHead className="whitespace-nowrap">Phone Number</TableHead>
                  <TableHead className="whitespace-nowrap">Company Name</TableHead>
                  <TableHead className="whitespace-nowrap">Position / Post</TableHead>
                  <TableHead className="whitespace-nowrap">Selection Date</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Tenure Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((placement) => (
                  <TableRow key={placement.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium text-foreground">{placement.name || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{placement.phoneNumber || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{placement.companyName || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{placement.positionPost || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatSelectedOn(placement.selectionDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Checkbox
                          checked={placement.tenureCompleted}
                          disabled={!canEditTenure || pendingId === placement.id}
                          onCheckedChange={(checked) => {
                            if (!canEditTenure) {
                              return;
                            }

                            handleTenureToggle(placement.id, Boolean(checked));
                          }}
                          aria-label={`Mark tenure completion for ${placement.name || "candidate"}`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="px-6 py-14 text-center">
              <p className="text-sm font-medium text-foreground">No selected candidates yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Only candidates with Selected status appear on this page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
