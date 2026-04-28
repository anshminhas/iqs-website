import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import DocModel from '@/models/Document';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';
import mongoose from 'mongoose';

export async function GET(req: Request, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    await connectToDatabase();

    const { clientId } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    
    // Authorization check: User must be an admin or super_admin
    if (!payload || (payload.role !== 'admin' && payload.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Explicitly cast to ObjectId and fetch documents
    const documents = await DocModel.find({ 
      clientId: new mongoose.Types.ObjectId(clientId) 
    })
      .populate('categoryId', 'name')
      .populate('uploadedBy', 'name email', undefined, { strictPopulate: false })
      .sort({ createdAt: -1 });

    console.log(`[Admin API] Data finalized for client ${clientId} - ${documents.length} entries.`);

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error: any) {
    console.error('Admin API Fetch Error:', error);
    return NextResponse.json({ error: error.message || 'Registry synchronization failed.' }, { status: 500 });
  }
}
