import type { JobDescriptionTableData } from "@/lib/job-description-sheet-table";

export interface JobDescriptionSheet {
  id: string;
  companyName: string;
  typeOfRoles: string;
  tableData: JobDescriptionTableData;
  rowColors?: (string | null)[] | null;
  columnWidths?: number[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobDescriptionSheetSummary {
  id: string;
  companyName: string;
  typeOfRoles: string;
  createdAt: string;
  updatedAt: string;
}
