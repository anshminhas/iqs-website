import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import PayrollRun from '@/models/PayrollRun';
import PayslipRecord from '@/models/PayslipRecord';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// GET /api/client/payroll?month=YYYY-MM&clientId=xxx (clientId only for admin/super_admin)
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get('month');

    // Determine clientId based on role
    let clientId: string | null = null;

    if (payload.role === 'client') {
      clientId = payload.clientId;
      if (!clientId) return NextResponse.json({ error: 'No client linked to this account' }, { status: 400 });
    } else if (payload.role === 'admin' || payload.role === 'super_admin') {
      // Admin/SuperAdmin must pass clientId explicitly
      clientId = searchParams.get('clientId');
      if (!clientId) return NextResponse.json({ error: 'clientId query param is required for admin access' }, { status: 400 });
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get last 12 payroll runs for this client
    const runs = await PayrollRun.find({ clientId, status: { $ne: 'draft' } })
      .sort({ month: -1 })
      .limit(12)
      .select('month status totalEmployees totalGross totalNetPay totalDeductions processedAt');

    if (!monthParam) {
      return NextResponse.json({ runs, payslips: [], run: null });
    }

    const run = await PayrollRun.findOne({ clientId, month: monthParam });
    if (!run) return NextResponse.json({ runs, payslips: [], run: null });

    const payslips = await PayslipRecord.find({ payrollRunId: run._id }).sort({ employeeName: 1 });

    return NextResponse.json({ runs, run, payslips });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
