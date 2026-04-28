export const runtime = 'nodejs';
export const maxDuration = 60; // allow up to 60s for large payroll runs

import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import PayrollConfig from '@/models/PayrollConfig';
import PayrollRun from '@/models/PayrollRun';
import PayslipRecord from '@/models/PayslipRecord';
import Client from '@/models/Client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import { computePayslip } from '@/utils/payrollEngine';
import { generatePayslipPDF } from '@/utils/payslipPDF';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadPDFToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'payslips',
        public_id: filename, // filename already has .pdf from the caller
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result!.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// POST /api/payroll/process
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

    const body = await req.json();
    const { clientId, month, rows, fileName, regenerate } = body;

    if (!clientId || !month || !rows?.length) {
      return NextResponse.json({ error: 'clientId, month, and rows are required' }, { status: 400 });
    }

    const normalizedMonth = month.substring(0, 7); // YYYY-MM

    // Get client info for PDF header
    const client = await Client.findById(clientId);
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

    // Get payroll formula config
    const config = await PayrollConfig.findOne({ clientId });
    const components = config?.components ?? getDefaultComponents();

    // Find or create payroll run
    let run = await PayrollRun.findOne({ clientId, month: normalizedMonth });

    if (run && !regenerate) {
      return NextResponse.json(
        { error: 'Payroll already processed for this month. Set regenerate=true to overwrite.' },
        { status: 409 }
      );
    }

    if (run) {
      // Delete old payslips for regeneration
      await PayslipRecord.deleteMany({ payrollRunId: run._id });
      run.status = 'regenerated';
    } else {
      run = new PayrollRun({
        clientId,
        month: normalizedMonth,
        status: 'draft',
        uploadedBy: payload.id,
        rawFileName: fileName || 'upload.csv',
      });
    }

    await run.save();

    // Process each employee row
    const payslipDocs = [];
    let totalGross = 0;
    let totalNetPay = 0;
    let totalDeductions = 0;

    for (const row of rows) {
      if (row.errors?.length > 0 && !row.gross) continue; // skip completely invalid rows

      const computed = await computePayslip(row, components);
      const finalErrors = [...(row.errors || []), ...computed.errors];
      
      payslipDocs.push({
        payrollRunId: run._id,
        clientId,
        employeeId: row.employeeId || '',
        employeeName: row.employeeName || '',
        department: row.department || '',
        designation: row.designation || '',
        gross: row.gross,
        daysWorked: row.daysWorked,
        daysInMonth: row.daysInMonth,
        components: computed.components,
        earningsTotal: computed.earningsTotal,
        deductionsTotal: computed.deductionsTotal,
        netPay: computed.netPay,
        errors: finalErrors,
      });

      totalGross += row.gross;
      totalNetPay += computed.netPay;
      totalDeductions += computed.deductionsTotal;
    }

    // Bulk insert payslips
    await PayslipRecord.insertMany(payslipDocs);

    // Update run summary
    run.totalEmployees = payslipDocs.length;
    run.totalGross = Math.round(totalGross * 100) / 100;
    run.totalNetPay = Math.round(totalNetPay * 100) / 100;
    run.totalDeductions = Math.round(totalDeductions * 100) / 100;
    run.status = regenerate ? 'regenerated' : 'processed';
    run.processedAt = new Date();
    await run.save();

    return NextResponse.json({
      success: true,
      runId: run._id,
      totalEmployees: payslipDocs.length,
      totalGross: run.totalGross,
      totalNetPay: run.totalNetPay,
      totalDeductions: run.totalDeductions,
    });
  } catch (err: any) {
    console.error('Process error:', err);
    return NextResponse.json({ error: err.message || 'Processing failed' }, { status: 500 });
  }
}

function getDefaultComponents() {
  return [
    { key: 'basic',             label: 'Basic Salary',    type: 'earning',   formula: 'gross * 0.4',                                  order: 1 },
    { key: 'hra',               label: 'HRA',             type: 'earning',   formula: 'basic * 0.5',                                  order: 2 },
    { key: 'special_allowance', label: 'Special Allow.',  type: 'earning',   formula: 'gross - basic - hra',                          order: 3 },
    { key: 'pf',                label: 'PF (Employee)',   type: 'deduction', formula: 'round(basic * 0.12)',                          order: 4 },
    { key: 'esic',              label: 'ESIC',            type: 'deduction', formula: 'gross <= 21000 ? round(gross * 0.0075) : 0',   order: 5 },
    { key: 'professional_tax',  label: 'Prof. Tax',       type: 'deduction', formula: '200',                                          order: 6 },
    { key: 'net_pay',           label: 'Net Pay',         type: 'result',    formula: 'earnings_total - deductions_total',            order: 7 },
  ] as any[];
}
