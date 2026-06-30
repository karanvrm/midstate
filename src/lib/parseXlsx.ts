import * as XLSX from 'xlsx';
import type { ParsedXlsx } from '@/types/tasks';

export function parseXlsxFile(file: File): Promise<ParsedXlsx> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            try {
                const result = e.target?.result;
                if (!result) throw new Error('Failed to read file');

                const workbook = XLSX.read(result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet, {
                    defval: '',
                });
                const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

                resolve({ rows, columns });
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('FileReader error'));
        reader.readAsBinaryString(file);
    });
}