export const JOB_DESCRIPTION_TABLE_ROWS = 15;
export const JOB_DESCRIPTION_TABLE_COLS = 10;

export type JobDescriptionTableData = string[][];

export const createEmptyJobDescriptionTable = (): JobDescriptionTableData =>
  Array.from({ length: JOB_DESCRIPTION_TABLE_ROWS }, () =>
    Array.from({ length: JOB_DESCRIPTION_TABLE_COLS }, () => ""),
  );

export const cloneJobDescriptionTable = (
  table: JobDescriptionTableData,
): JobDescriptionTableData => table.map((row) => [...row]);

export const tablesAreEqual = (
  left: JobDescriptionTableData,
  right: JobDescriptionTableData,
): boolean => JSON.stringify(left) === JSON.stringify(right);

export const normalizeJobDescriptionTable = (
  value: unknown,
): JobDescriptionTableData => {
  if (!Array.isArray(value) || value.length === 0) {
    return createEmptyJobDescriptionTable();
  }

  const rowCount = value.length;
  let maxColCount = 0;
  for (let i = 0; i < rowCount; i++) {
    const row = value[i];
    if (Array.isArray(row)) {
      maxColCount = Math.max(maxColCount, row.length);
    }
  }

  const colCount = maxColCount > 0 ? maxColCount : JOB_DESCRIPTION_TABLE_COLS;

  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const row = value[rowIndex];

    if (!Array.isArray(row)) {
      return Array.from({ length: colCount }, () => "");
    }

    return Array.from({ length: colCount }, (_, colIndex) => {
      const cell = row[colIndex];
      return typeof cell === "string" ? cell : "";
    });
  });
};
