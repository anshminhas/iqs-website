import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import mongoose from 'mongoose';

// Ensure models are registered
import '@/models/PayslipRecord';
import '@/models/PayrollRun';
import '@/models/Client';
import '@/models/PayrollConfig';

const PayslipRecord = mongoose.models.PayslipRecord || require('@/models/PayslipRecord').default;
const PayrollRun = mongoose.models.PayrollRun || require('@/models/PayrollRun').default;
const Client = mongoose.models.Client || require('@/models/Client').default;
const PayrollConfig = mongoose.models.PayrollConfig || require('@/models/PayrollConfig').default;

import { generatePayslipPDF } from '@/utils/payslipPDF';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const payslipId = searchParams.get('id');

    if (!payslipId) {
      return NextResponse.json({ error: 'Missing payslip ID' }, { status: 400 });
    }

    // 1. Verify Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Fetch Payslip Record
    const payslip = await PayslipRecord.findById(payslipId);
    if (!payslip) {
      return NextResponse.json({ error: 'Payslip not found' }, { status: 404 });
    }

    // 3. Permission Check (Client can only see their own, Admin/SuperAdmin see all)
    if (payload.role === 'client' && String(payslip.clientId) !== String(payload.clientId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 4. Fetch additional info for PDF
    const run = await PayrollRun.findById(payslip.payrollRunId);
    if (!run) return NextResponse.json({ error: 'Payroll Run data missing' }, { status: 404 });

    const cId = run.clientId;
    console.log(`[DownloadAPI] Searching for Config with ClientID: ${cId} (Type: ${typeof cId})`);

    const client = await Client.findById(cId);
    
    // Multi-stage config lookup
    let config = await PayrollConfig.findOne({ clientId: cId });
    
    if (!config) {
      console.log(`[DownloadAPI] Config not found by ObjectId, trying string match...`);
      config = await PayrollConfig.findOne({ clientId: cId.toString() });
    }

    if (!config) {
       console.log(`[DownloadAPI] Still not found. Checking all configs for a match...`);
       const allConfigs = await PayrollConfig.find({});
       config = allConfigs.find(c => String(c.clientId) === String(cId));
    }

    if (!client) {
      return NextResponse.json({ error: 'Client data missing' }, { status: 500 });
    }

    // FALLBACK: If config is missing, reconstruct it from payslip components
    let componentDefs = config?.components;
    if (!componentDefs) {
      console.warn(`[DownloadAPI] CRITICAL: Config missing for Client ${cId}. Using fallback reconstruction.`);
      const FALLBACK_DEDUCTION_KEYS = new Set(['pf', 'pf_employee', 'esic', 'professional_tax', 'tax', 'tds', 'loan', 'advance_salary']);
      componentDefs = Object.entries(payslip.components || {}).map(([key, value], idx) => ({
        key,
        label: key.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        type: FALLBACK_DEDUCTION_KEYS.has(key.toLowerCase()) ? 'deduction' : 'earning',
        formula: '',
        order: idx
      }));
    }

    // 5. Generate PDF on the fly
    const pdfBuffer = await generatePayslipPDF({
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
    });

    // 6. Return as PDF stream
    const filename = `Payslip_${payslip.employeeName.replace(/\s+/g, '_')}_${run.month}.pdf`;
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Payslip download error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
