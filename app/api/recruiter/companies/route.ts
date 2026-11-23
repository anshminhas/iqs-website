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

export async function GET() {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Fetch all recruiting companies
    const companies = await RecruitingCompany.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Attach candidate counts and stats per company
    const companiesWithStats = await Promise.all(
      companies.map(async (company: any) => {
        const candidateCount = await Candidate.countDocuments({ companyId: company._id });
        const selectedCount = await Candidate.countDocuments({
          companyId: company._id,
          status: { $in: ['Selected', 'Onboarded'] },
        });
        const activeCount = await Candidate.countDocuments({
          companyId: company._id,
          status: { $in: ['Applied', 'Screening', 'Interview Scheduled', 'Shortlisted'] },
        });
        return {
          ...company,
          candidateCount,
          selectedCount,
          activeCount,
        };
      })
    );

    return NextResponse.json({ companies: companiesWithStats }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const payload = await getAuthPayload();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { name, industry, location, website, description } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const company = new RecruitingCompany({
      name: name.trim(),
      industry: industry?.trim() || '',
      location: location?.trim() || '',
      website: website?.trim() || '',
      description: description?.trim() || '',
      createdBy: payload.id,
    });

    await company.save();

    return NextResponse.json(
      {
        message: 'Company created successfully',
        company: {
          ...company.toObject(),
          candidateCount: 0,
          selectedCount: 0,
          activeCount: 0,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create company' }, { status: 500 });
  }
}
