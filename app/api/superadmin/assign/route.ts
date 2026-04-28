import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// POST /api/superadmin/assign  { adminId, clientId }
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { adminId, clientId } = await req.json();
    if (!adminId || !clientId) {
      return NextResponse.json({ error: 'adminId and clientId are required' }, { status: 400 });
    }

    const [admin, client] = await Promise.all([User.findById(adminId), Client.findById(clientId)]);
    if (!admin || !client) return NextResponse.json({ error: 'Admin or Client not found' }, { status: 404 });

    // Idempotent push
    await Promise.all([
      User.findByIdAndUpdate(adminId, { $addToSet: { assignedClients: clientId } }),
      Client.findByIdAndUpdate(clientId, { $addToSet: { assignedAdminIds: adminId } }),
    ]);

    return NextResponse.json({ message: 'Assignment successful' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error assigning client' }, { status: 500 });
  }
}
