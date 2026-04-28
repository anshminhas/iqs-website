import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import PayslipRecord from '@/models/PayslipRecord';
import PayrollRun from '@/models/PayrollRun';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// GET /api/payroll/payslips/[runId]
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

    const payslips = await PayslipRecord.find({ payrollRunId: runId }).sort({ employeeName: 1 });

    return NextResponse.json({ run, payslips });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
