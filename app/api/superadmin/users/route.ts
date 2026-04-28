import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all admins (excluding passwords)
    const admins = await User.find({ role: 'admin' }, { password: 0 }).sort({ createdAt: -1 });

    // Fetch all clients
    const clients = await Client.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ admins, clients }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching users' }, { status: 500 });
  }
}
