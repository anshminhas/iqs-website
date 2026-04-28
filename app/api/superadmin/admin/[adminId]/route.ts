import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import ActivityLog from '@/models/ActivityLog';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export async function GET(req: Request, { params }: { params: Promise<{ adminId: string }> }) {
  try {
    await connectToDatabase();

    const { adminId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch Admin with populated clients
    const admin = await User.findById(adminId)
      .populate('assignedClients')
      .select('-password');

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Fetch activity logs for this specific admin
    const logs = await ActivityLog.find({ adminId })
      .sort({ createdAt: -1 })
      .limit(30);

    return NextResponse.json({ admin, logs }, { status: 200 });
  } catch (error: any) {
    console.error('Admin Detail API Error:', error);
    return NextResponse.json({ error: error.message || 'Error fetching admin details' }, { status: 500 });
  }
}
