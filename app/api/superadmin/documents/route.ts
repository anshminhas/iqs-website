import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import Document from '@/models/Document';

export async function GET() {
  try {
    await connectToDatabase();

    // Populate client details and uploader (admin) details for context
    const documents = await Document.find({})
      .populate('clientId', 'companyName')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ documents }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching documents' }, { status: 500 });
  }
}
