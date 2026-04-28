import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import DocModel from '@/models/Document';
import Category from '@/models/Category';
import ActivityLog from '@/models/ActivityLog';
import cloudinary from '@/utils/cloudinary';
import { Readable } from 'stream';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Authenticate from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || payload.role === 'client') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const uploaderId = payload.id;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('clientId') as string;
    const rawMonth = formData.get('month') as string;
    const month = rawMonth ? rawMonth.substring(0, 7) : ''; // Normalize to YYYY-MM
    const categoryId = formData.get('categoryId') as string;
    const subcategory = (formData.get('subcategory') as string) || '';
    const remarks = (formData.get('remarks') as string) || '';

    if (!file || !clientId || !month || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields: file, clientId, month, categoryId' }, { status: 400 });
    }

    // Strict PDF validation
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPDF) {
      return NextResponse.json({ error: 'Only PDF documents are allowed for compatibility and security.' }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit.' }, { status: 413 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const publicId = `iqs_${clientId}_${month}_${categoryId}_${Date.now()}`;
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'iqs-documents', resource_type: 'raw', public_id: publicId },
        (error, result) => { if (error) reject(error); else resolve(result); }
      );
      const readable = new Readable({ read() { this.push(buffer); this.push(null); } });
      readable.pipe(stream);
    });

    const filePayload = { url: uploadResult.secure_url, public_id: uploadResult.public_id };
    const versionEntry = { ...filePayload, version: 1, uploadedBy: uploaderId, uploadedAt: new Date(), remarks };

    // Always create a new document record — admins can upload as many files as needed.
    // The stale unique-index has been dropped; each upload is an independent record.
    const savedDoc = await DocModel.create({
      clientId, categoryId, subcategory, month, status: 'pending',
      file: filePayload, version: 1, uploadedBy: uploaderId, history: [versionEntry],
    });

    // Audit log
    await ActivityLog.create({
      adminId: uploaderId,
      targetId: savedDoc._id,
      action: 'DOC_UPLOAD',
      description: `Uploaded v${versionEntry.version} for month ${month}`,
    });

    return NextResponse.json({ message: 'Document uploaded successfully', document: savedDoc }, { status: 201 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
