import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import Candidate, { CANDIDATE_STATUSES, CandidateStatus } from '@/models/Candidate';
import RecruitingCompany from '@/models/RecruitingCompany';
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

    const filter: Record<string, any> = {};

    if (companyId) {
      filter.companyId = companyId;
    }

    if (status && status !== 'ALL' && status !== 'All') {
      filter.status = status;
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phno: { $regex: q, $options: 'i' } },
        { role: { $regex: q, $options: 'i' } },
        { companyName: { $regex: q, $options: 'i' } },
      ];
    }

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

    return NextResponse.json({ candidates }, { status: 200 });
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

    // Lookup company if companyName missing
    if (!companyName || !companyName.trim()) {
      const company = await RecruitingCompany.findById(companyId);
      if (!company) {
        return NextResponse.json({ error: 'Company not found' }, { status: 404 });
      }
      companyName = company.name;
    }

    // Validate status
    if (!status || !CANDIDATE_STATUSES.includes(status as CandidateStatus)) {
      status = 'Applied';
    }

    const candidate = new Candidate({
      name: name.trim(),
      phno: phno.trim(),
      email: email.trim(),
      role: role.trim(),
      companyId,
      companyName: companyName.trim(),
      status,
      joiningDate: joiningDate?.trim() || '',
      notes: notes?.trim() || '',
      createdBy: payload.id,
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
