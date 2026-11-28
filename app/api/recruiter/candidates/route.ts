import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/utils/db';
import Candidate, { CANDIDATE_STATUSES, CandidateStatus } from '@/models/Candidate';
import RecruitingCompany from '@/models/RecruitingCompany';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getAuthPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('dms_auth')?.value;
  if (!token) return null;
  const payload: any = await verifyToken(token);
  if (!payload) return null;
  if (payload.role !== 'recruiter' && payload.role !== 'super_admin') return null;
  return payload;
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    const conditions: any[] = [];

    if (companyId) {
      if (payload.role === 'recruiter') {
        const userObjId = mongoose.Types.ObjectId.isValid(payload.id)
          ? new mongoose.Types.ObjectId(payload.id)
          : payload.id;
        const company = await RecruitingCompany.findOne({
          _id: companyId,
          $or: [{ createdBy: payload.id }, { createdBy: userObjId }],
        });
        if (!company) {
          return NextResponse.json({ error: 'Company not found or access denied' }, { status: 404 });
        }
      }
      const compObjId = mongoose.Types.ObjectId.isValid(companyId)
        ? new mongoose.Types.ObjectId(companyId)
        : companyId;
      conditions.push({
        $or: [{ companyId }, { companyId: compObjId }],
      });
    } else if (payload.role === 'recruiter') {
      const userObjId = mongoose.Types.ObjectId.isValid(payload.id)
        ? new mongoose.Types.ObjectId(payload.id)
        : payload.id;
      const myCompanies = await RecruitingCompany.find(
        { $or: [{ createdBy: payload.id }, { createdBy: userObjId }] },
        { _id: 1 }
      ).lean();
      const myCompanyIds = myCompanies.map((c: any) => c._id);
      conditions.push({
        $or: [
          { createdBy: payload.id },
          { createdBy: userObjId },
          { companyId: { $in: myCompanyIds } },
        ],
      });
    }

    if (status && status !== 'ALL' && status !== 'All') {
      conditions.push({ status });
    }

    if (search && search.trim()) {
      const q = search.trim();
      conditions.push({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { phno: { $regex: q, $options: 'i' } },
          { role: { $regex: q, $options: 'i' } },
          { companyName: { $regex: q, $options: 'i' } },
        ],
      });
    }

    const filter = conditions.length > 0 ? { $and: conditions } : {};

    // Sorting
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'name-asc') {
      sortOption = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOption = { name: -1 };
    } else if (sort === 'status-asc') {
      sortOption = { status: 1, createdAt: -1 };
    } else if (sort === 'status-desc') {
      sortOption = { status: -1, createdAt: -1 };
    }

    const candidates = await Candidate.find(filter).sort(sortOption).lean();

    return NextResponse.json(
      { candidates },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch candidates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, phno, email, role, companyId, notes, joiningDate } = body;
    let { companyName, status } = body;

    if (!name || !phno || !email || !role || !companyId) {
      return NextResponse.json(
        { error: 'Name, phone number, email, role, and company are required' },
        { status: 400 }
      );
    }

    // Verify company exists and belongs to the recruiter
    const company = await RecruitingCompany.findById(companyId);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const creatorId = String(company.createdBy?._id || company.createdBy || '');
    if (payload.role === 'recruiter' && creatorId !== String(payload.id)) {
      return NextResponse.json(
        { error: 'Forbidden: You cannot add candidates to another recruiter\'s company' },
        { status: 403 }
      );
    }

    companyName = company.name;

    // Validate status
    if (!status || !CANDIDATE_STATUSES.includes(status as CandidateStatus)) {
      status = 'Applied';
    }

    const userObjId = mongoose.Types.ObjectId.isValid(payload.id)
      ? new mongoose.Types.ObjectId(payload.id)
      : payload.id;
    const compObjId = mongoose.Types.ObjectId.isValid(companyId)
      ? new mongoose.Types.ObjectId(companyId)
      : companyId;

    const candidate = new Candidate({
      name: name.trim(),
      phno: phno.trim(),
      email: email.trim(),
      role: role.trim(),
      companyId: compObjId,
      companyName: companyName.trim(),
      status,
      joiningDate: joiningDate?.trim() || '',
      notes: notes?.trim() || '',
      createdBy: userObjId,
    });

    await candidate.save();

    return NextResponse.json(
      { message: 'Candidate added successfully', candidate: candidate.toObject() },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add candidate' }, { status: 500 });
  }
}
