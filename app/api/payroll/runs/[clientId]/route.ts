import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import PayrollRun from '@/models/PayrollRun';
import PayslipRecord from '@/models/PayslipRecord';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// GET /api/payroll/runs/[clientId] — list last 12 months payroll runs
export async function GET(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    await connectToDatabase();
    const { clientId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const runs = await PayrollRun.find({ clientId })
      .sort({ month: -1 })
      .limit(12)
      .populate('uploadedBy', 'name email');

    return NextResponse.json({ runs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
