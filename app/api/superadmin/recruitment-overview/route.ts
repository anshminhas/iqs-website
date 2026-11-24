import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import RecruitingCompany from '@/models/RecruitingCompany';
import Candidate from '@/models/Candidate';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 });
    }

    const recruiters = await User.find({ role: 'recruiter' }, { password: 0 })
      .sort({ createdAt: -1 })
      .lean();

    const companies = await RecruitingCompany.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .lean();

    const candidates = await Candidate.find({})
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .lean();

    // Attach stats per recruiter
    const recruitersWithStats = recruiters.map((r: any) => {
      const rCompanies = companies.filter(
        (c: any) => String(c.createdBy?._id || c.createdBy) === String(r._id)
      );
      const rCompanyIds = new Set(rCompanies.map((c: any) => String(c._id)));

      const rCandidates = candidates.filter(
        (cand: any) =>
          String(cand.createdBy?._id || cand.createdBy) === String(r._id) ||
          rCompanyIds.has(String(cand.companyId))
      );

      return {
        ...r,
        companiesCount: rCompanies.length,
        candidatesCount: rCandidates.length,
        selectedCount: rCandidates.filter((c: any) =>
          ['Selected', 'Onboarded'].includes(c.status)
        ).length,
      };
    });

    const globalStats = {
      totalRecruiters: recruiters.length,
      totalCompanies: companies.length,
      totalCandidates: candidates.length,
      selectedCount: candidates.filter((c: any) =>
        ['Selected', 'Onboarded'].includes(c.status)
      ).length,
      pipelineCount: candidates.filter((c: any) =>
        ['Applied', 'Screening', 'Interview Scheduled', 'Shortlisted'].includes(c.status)
      ).length,
    };

    return NextResponse.json(
      {
        recruiters: recruitersWithStats,
        companies,
        candidates,
        stats: globalStats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recruitment overview' },
      { status: 500 }
    );
  }
}
