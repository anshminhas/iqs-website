import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// Ensure Category model is registered for populate()
import '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (payload.role === 'super_admin') {
      const allClients = await Client.find().populate({
        path: 'assignedCategoryIds',
        select: 'name subcategories',
      });
      return NextResponse.json({ clients: allClients }, { status: 200 });
    }

    const admin = await User.findById(payload.id).populate({
      path: 'assignedClients',
      populate: { path: 'assignedCategoryIds', select: 'name subcategories' },
    });

    if (!admin) {
      console.error(`Admin user not found in DB for ID: ${payload.id}`);
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    let clients = admin.assignedClients || [];

    // Fallback: If assignedClients is empty, check the Client collection directly
    // This handles cases where the two-way link might be broken
    if (clients.length === 0) {
      console.log(`No assignedClients found on User ${payload.id}, checking Client collection...`);
      clients = await Client.find({ assignedAdminIds: payload.id }).populate({
        path: 'assignedCategoryIds',
        select: 'name subcategories',
      });
      console.log(`Found ${clients.length} clients via fallback check`);
    }

    return NextResponse.json({ clients }, { status: 200 });
  } catch (error: any) {
    console.error('Error in /api/admin/clients:', error);
    return NextResponse.json({ error: error.message || 'Error fetching clients' }, { status: 500 });
  }
}
