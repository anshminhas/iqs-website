import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import Candidate, { CANDIDATE_STATUSES, CandidateStatus } from '@/models/Candidate';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

async function getAuthPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('dms_auth')?.value;
  if (!token) return null;
  const payload: any = await verifyToken(token);
  if (!payload) return null;
  if (payload.role !== 'recruiter' && payload.role !== 'super_admin') return null;
  return payload;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    const updateFields: Record<string, any> = {};

    if (body.status !== undefined) {
      if (!CANDIDATE_STATUSES.includes(body.status as CandidateStatus)) {
        return NextResponse.json({ error: 'Invalid candidate status' }, { status: 400 });
      }
      updateFields.status = body.status;
    }

    if (body.name !== undefined) updateFields.name = String(body.name).trim();
    if (body.phno !== undefined) updateFields.phno = String(body.phno).trim();
    if (body.email !== undefined) updateFields.email = String(body.email).trim();
    if (body.role !== undefined) updateFields.role = String(body.role).trim();
    if (body.joiningDate !== undefined) updateFields.joiningDate = String(body.joiningDate).trim();
    if (body.notes !== undefined) updateFields.notes = String(body.notes).trim();

    const updated = await Candidate.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Candidate updated successfully', candidate: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update candidate' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const deleted = await Candidate.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Candidate removed successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete candidate' }, { status: 500 });
  }
}
