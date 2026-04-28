export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import PayrollRun from '@/models/PayrollRun';
import PayslipRecord from '@/models/PayslipRecord';
import PayrollConfig from '@/models/PayrollConfig';
import Client from '@/models/Client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import * as XLSX from 'xlsx';

// GET /api/payroll/export/[runId]
export async function GET(req: Request, { params }: { params: Promise<{ runId: string }> }) {
  try {
    await connectToDatabase();
    const { runId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const run = await PayrollRun.findById(runId);
    if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 });

    const client = await Client.findById(run.clientId);
    const config = await PayrollConfig.findOne({ clientId: run.clientId });
    const payslips = await PayslipRecord.find({ payrollRunId: runId }).sort({ employeeName: 1 });

    if (!payslips.length) {
      return NextResponse.json({ error: 'No payslips found for this run' }, { status: 404 });
    }

    // Determine component columns from config AND any dynamically injected keys (like overtime, actual_salary_uncalculated)
    const configKeys = config?.components
      ? config.components.sort((a: any, b: any) => a.order - b.order).map((c: any) => c.key)
      : [];
      
    // Force standard dynamic fields to ALWAYS appear in the CSV headers
    const allPresentKeys = new Set(['overtime', 'incentive', 'bonus', 'loan', 'advance_salary']);
    payslips.forEach(p => {
       Object.keys(p.components || {}).forEach(k => allPresentKeys.add(k));
    });
    
    const dynamicKeys = Array.from(allPresentKeys).filter(k => !configKeys.includes(k) && k !== 'actual_salary_uncalculated');
    const componentKeys: string[] = [...configKeys, ...dynamicKeys];

    const componentLabels: Record<string, string> = {};
    if (config?.components) {
      for (const c of config.components) {
        componentLabels[c.key] = c.label;
      }
    }

    // Build header row
    const headers = [
      'Employee ID',
      'Employee Name',
      'Department',
      'Designation',
      'CTC',
      'Salary W.D',
      'Days Worked',
      'Days In Month',
      ...componentKeys.map(k => componentLabels[k] || k.replace(/_/g, ' ').toUpperCase()),
      'Total Earnings',
      'Total Deductions',
      'Net Pay',
      'Errors',
    ];

    // Build data rows
    const rows = payslips.map(p => {
      const compValues = componentKeys.map(k => {
        const val = p.components?.[k];
        return (val === undefined || val === 0) ? '-' : val;
      });
      return [
        p.employeeId,
        p.employeeName,
        p.department,
        p.designation,
        p.gross,                                                   // CTC — raw input as-is
        p.components?.['actual_salary_uncalculated'] || 0,         // Salary W.D — prorated
        p.daysWorked,
        p.daysInMonth,
        ...compValues,
        p.earningsTotal,
        p.deductionsTotal,
        p.netPay,
        (p.errors || []).join('; '),
      ];
    });

    // Summary row
    const totalActual      = payslips.reduce((s, p) => s + ((p.components?.['actual_salary_uncalculated'] as number) || 0), 0);
    const totalEarnings    = payslips.reduce((s, p) => s + (p.earningsTotal || 0), 0);
    const totalDeductions  = payslips.reduce((s, p) => s + (p.deductionsTotal || 0), 0);
    const totalNetPay      = payslips.reduce((s, p) => s + (p.netPay || 0), 0);

    const summaryRow = [
      '', 'TOTAL', '', '',
      '', totalActual, '', '',       // CTC col empty in total, Salary W.D has its total
      ...componentKeys.map(() => ''),
      totalEarnings,
      totalDeductions,
      totalNetPay,
      '',
    ];

    // Build worksheet
    const wsData = [headers, ...rows, [], summaryRow];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Column widths
    ws['!cols'] = [
      { wch: 14 }, { wch: 24 }, { wch: 18 }, { wch: 20 },
      { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 14 },
      ...componentKeys.map(() => ({ wch: 16 })),
      { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 30 },
    ];

    // Freeze first row
    ws['!freeze'] = { xSplit: 0, ySplit: 1 };

    const wb = XLSX.utils.book_new();
    const sheetName = `Payroll ${run.month}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Add a summary sheet
    const summaryWs = XLSX.utils.aoa_to_sheet([
      ['Company',        client?.companyName || ''],
      ['Pay Period',     run.month],
      ['Status',         run.status],
      ['Total Employees', run.totalEmployees],
      ['Total Salary W.D', totalActual],
      ['Total Deductions', run.totalDeductions],
      ['Net Payable',    run.totalNetPay],
      ['Processed At',   run.processedAt ? new Date(run.processedAt).toISOString() : ''],
    ]);
    summaryWs['!cols'] = [{ wch: 20 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const fileName = `payroll_${client?.companyName?.replace(/\s+/g, '_') || 'export'}_${run.month}.xlsx`;

    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(excelBuffer.length),
      },
    });
  } catch (err: any) {
    console.error('Excel export error:', err);
    return NextResponse.json({ error: err.message || 'Export failed' }, { status: 500 });
  }
}
