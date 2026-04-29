export const runtime = 'nodejs';
export const maxDuration = 60;

import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import mongoose from 'mongoose';
import { generateMultiPayslipPDF } from '@/utils/payslipPDF';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// Ensure models are registered
import '@/models/PayslipRecord';
import '@/models/PayrollRun';
import '@/models/Client';
import '@/models/PayrollConfig';

const PayslipRecord = mongoose.models.PayslipRecord || require('@/models/PayslipRecord').default;
const PayrollRun = mongoose.models.PayrollRun || require('@/models/PayrollRun').default;
const Client = mongoose.models.Client || require('@/models/Client').default;
const PayrollConfig = mongoose.models.PayrollConfig || require('@/models/PayrollConfig').default;

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const runId = searchParams.get('runId');

    if (!runId) {
      return NextResponse.json({ error: 'Missing run ID' }, { status: 400 });
    }

    // 1. Verify Authentication (Admin only for "Download All")
    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Fetch Payroll Run and Client
    const run = await PayrollRun.findById(runId);
    if (!run) return NextResponse.json({ error: 'Payroll run not found' }, { status: 404 });

    const client = await Client.findById(run.clientId);
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    // 3. Fetch Config (with fallback support)
    const config = await PayrollConfig.findOne({ clientId: run.clientId });

    // 4. Fetch all payslips for this run
    const payslips = await PayslipRecord.find({ payrollRunId: runId }).sort({ employeeName: 1 });
    if (payslips.length === 0) {
      return NextResponse.json({ error: 'No payslips found for this run' }, { status: 404 });
    }

    // 5. Prepare data for PDF generator
    const items = payslips.map(payslip => {
      let componentDefs = config?.components;
      if (!componentDefs) {
        // Fallback reconstruction
        const FALLBACK_DEDUCTION_KEYS = new Set(['pf', 'pf_employee', 'esic', 'professional_tax', 'tax', 'tds', 'loan', 'advance_salary']);
        componentDefs = Object.entries(payslip.components || {}).map(([key, value], idx) => ({
          key,
          label: key.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
          type: FALLBACK_DEDUCTION_KEYS.has(key.toLowerCase()) ? 'deduction' : 'earning',
          formula: '',
          order: idx
        }));
      }

      return {
        companyName: client.companyName,
        companyAddress: client.address || '',
        logoUrl: client.logoUrl || '',
        month: run.month,
        employeeId: payslip.employeeId,
        employeeName: payslip.employeeName,
        department: payslip.department,
        designation: payslip.designation,
        gross: payslip.gross,
        daysWorked: payslip.daysWorked,
        daysInMonth: payslip.daysInMonth,
        components: payslip.components,
        earningsTotal: payslip.earningsTotal,
        deductionsTotal: payslip.deductionsTotal,
        netPay: payslip.netPay,
        componentDefs: componentDefs
      };
    });

    // 6. Generate Combined PDF
    const pdfBuffer = await generateMultiPayslipPDF(items);

    // 7. Return as PDF stream
    const filename = `All_Payslips_${client.companyName.replace(/\s+/g, '_')}_${run.month}.pdf`;
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Download All error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
