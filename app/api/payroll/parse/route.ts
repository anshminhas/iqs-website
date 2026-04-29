import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import * as XLSX from 'xlsx';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// Column name aliases — case-insensitive mapping
const COLUMN_MAP: Record<string, string> = {
  'employee_id': 'employeeId',
  'emp_id': 'employeeId',
  'empid': 'employeeId',
  'employee_name': 'employeeName',
  'emp_name': 'employeeName',
  'name': 'employeeName',
  'department': 'department',
  'dept': 'department',
  'designation': 'designation',
  'position': 'designation',
  'gross': 'gross',
  'gross_salary': 'gross',
  'ctc': 'gross',
  'days_worked': 'daysWorked',
  'working_days': 'daysWorked',
  'days': 'daysWorked',
  'days_in_month': 'daysInMonth',
  'esic': 'esic',
  'esic_req': 'esic',
  'pf': 'pf',
  'pf_req': 'pf',
};

function normalizeRow(raw: Record<string, any>): { data: Record<string, any>; errors: string[] } {
  const data: Record<string, any> = {};
  const errors: string[] = [];

  // Remap columns
  for (const [rawKey, rawVal] of Object.entries(raw)) {
    const normalized = COLUMN_MAP[rawKey.toLowerCase().trim()];
    if (normalized) {
      data[normalized] = rawVal;
    } else {
      data[rawKey] = rawVal; // pass-through unknown columns
    }
  }

  // Required fields validation
  if (!data.employeeId) errors.push('Missing employee_id');
  if (!data.employeeName) errors.push('Missing employee_name');
  if (!data.gross || isNaN(Number(data.gross))) errors.push('Missing or invalid gross salary');

  // Numeric coercions
  data.gross = Number(data.gross) || 0;
  data.daysWorked = Number(data.daysWorked) || 30;
  data.daysInMonth = Number(data.daysInMonth) || 30;
  data.department = data.department || '';
  data.designation = data.designation || '';

  return { data, errors };
}

// POST /api/payroll/parse
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const month = (formData.get('month') as string)?.substring(0, 7); // YYYY-MM

    if (!file || !clientId || !month) {
      return NextResponse.json({ error: 'file, clientId, and month are required' }, { status: 400 });
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to JSON
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (rawRows.length === 0) {
      return NextResponse.json({ error: 'File is empty or has no data rows' }, { status: 400 });
    }

    // Normalize all rows
    const rows = rawRows.map((raw, index) => {
      const { data, errors } = normalizeRow(raw);
      return { rowIndex: index + 2, ...data, errors };  // rowIndex starts at 2 (1 = header)
    });

    const totalErrors = rows.filter(r => r.errors.length > 0).length;

    return NextResponse.json({
      success: true,
      fileName: file.name,
      clientId,
      month,
      totalRows: rows.length,
      totalErrors,
      rows,
    });
  } catch (err: any) {
    console.error('Parse error:', err);
    return NextResponse.json({ error: err.message || 'Parse failed' }, { status: 500 });
  }
}
