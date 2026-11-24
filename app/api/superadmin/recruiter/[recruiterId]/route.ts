import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import RecruitingCompany from '@/models/RecruitingCompany';
import Candidate from '@/models/Candidate';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export async function GET(req: Request, { params }: { params: Promise<{ recruiterId: string }> }) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 });
    }

    const { recruiterId } = await params;

    const recruiter = await User.findOne({ _id: recruiterId, role: 'recruiter' }, { password: 0 }).lean();
    if (!recruiter) {
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }

    // Fetch companies associated with this recruiter
    const companies = await RecruitingCompany.find({ createdBy: recruiterId })
      .sort({ createdAt: -1 })
      .lean();

    const companyIds = companies.map((c: any) => c._id);

    // Fetch all candidates under this recruiter's companies or created by this recruiter
    const candidates = await Candidate.find({
      $or: [{ createdBy: recruiterId }, { companyId: { $in: companyIds } }],
    })
      .sort({ createdAt: -1 })
      .lean();

    // Map candidate counts per company
    const companiesWithCounts = companies.map((c: any) => {
      const cCandidates = candidates.filter(
        (cand: any) => String(cand.companyId) === String(c._id)
      );
      return {
        ...c,
        candidateCount: cCandidates.length,
        selectedCount: cCandidates.filter((cand: any) =>
          ['Selected', 'Onboarded'].includes(cand.status)
        ).length,
      };
    });

    const stats = {
      totalCompanies: companies.length,
      totalCandidates: candidates.length,
      selectedCount: candidates.filter((cand: any) =>
        ['Selected', 'Onboarded'].includes(cand.status)
      ).length,
      pipelineCount: candidates.filter((cand: any) =>
        ['Applied', 'Screening', 'Interview Scheduled', 'Shortlisted'].includes(cand.status)
      ).length,
    };

    return NextResponse.json(
      {
        recruiter,
        companies: companiesWithCounts,
        candidates,
        stats,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recruiter details' },
      { status: 500 }
    );
  }
}
