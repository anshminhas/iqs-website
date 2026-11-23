import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import RecruitingCompany from '@/models/RecruitingCompany';
import Candidate from '@/models/Candidate';
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

export async function GET(req: Request, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { companyId } = await params;
    const company = await RecruitingCompany.findById(companyId).lean();
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const candidateCount = await Candidate.countDocuments({ companyId });

    return NextResponse.json(
      {
        company: {
          ...company,
          candidateCount,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch company' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ companyId: string }> }) {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { companyId } = await params;
    await Candidate.deleteMany({ companyId });
    await RecruitingCompany.findByIdAndDelete(companyId);

    return NextResponse.json({ message: 'Company and associated candidates removed' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete company' }, { status: 500 });
  }
}
