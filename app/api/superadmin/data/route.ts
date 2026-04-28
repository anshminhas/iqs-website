import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';
import Category from '@/models/Category';
import ActivityLog from '@/models/ActivityLog';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [admins, clients, categories, logs] = await Promise.all([
      User.find({ role: 'admin' }, { password: 0 })
        .populate('assignedClients', 'companyName contactEmail')
        .sort({ createdAt: -1 }),
      Client.find({})
        .populate('assignedAdminIds', 'name email')
        .populate('assignedCategoryIds', 'name')
        .sort({ createdAt: -1 }),
      Category.find({}).sort({ name: 1 }),
      ActivityLog.find({})
        .populate('adminId', 'name email')
        .sort({ createdAt: -1 })
        .limit(100),
    ]);

    return NextResponse.json({
      admins: JSON.parse(JSON.stringify(admins)),
      clients: JSON.parse(JSON.stringify(clients)),
      categories: JSON.parse(JSON.stringify(categories)),
      logs: JSON.parse(JSON.stringify(logs)),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching data' }, { status: 500 });
  }
}
