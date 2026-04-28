import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import PayrollConfig from '@/models/PayrollConfig';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// GET /api/payroll/config/[clientId]
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

    const config = await PayrollConfig.findOne({ clientId });

    // If no config exists, return sensible defaults
    if (!config) {
      return NextResponse.json({
        config: null,
        defaults: [
          { key: 'basic',             label: 'Basic Salary',   type: 'earning',   formula: 'gross * 0.4',                           order: 1 },
          { key: 'hra',               label: 'HRA',            type: 'earning',   formula: 'basic * 0.5',                           order: 2 },
          { key: 'special_allowance', label: 'Special Allow.', type: 'earning',   formula: 'gross - basic - hra',                   order: 3 },
          { key: 'pf',                label: 'PF (Employee)',  type: 'deduction', formula: 'round(basic * 0.12)',                   order: 4 },
          { key: 'esic',              label: 'ESIC',           type: 'deduction', formula: 'gross <= 21000 ? round(gross * 0.0075) : 0', order: 5 },
          { key: 'professional_tax',  label: 'Prof. Tax',      type: 'deduction', formula: '200',                                   order: 6 },
          { key: 'net_pay',           label: 'Net Pay',        type: 'result',    formula: 'earnings_total - deductions_total',      order: 7 },
        ]
      });
    }

    return NextResponse.json({ config });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/payroll/config/[clientId]
export async function POST(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
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

    const body = await req.json();
    const { components } = body;

    if (!components || !Array.isArray(components)) {
      return NextResponse.json({ error: 'components array is required' }, { status: 400 });
    }

    const config = await PayrollConfig.findOneAndUpdate(
      { clientId },
      {
        clientId,
        components,
        updatedBy: payload.id,
        $inc: { version: 1 },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, config });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
