import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';
import RecruitingCompany from '@/models/RecruitingCompany';
import Candidate from '@/models/Candidate';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 });
    }

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent super admin from deleting themselves
    if (String(payload.id) === String(userId)) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (user) {
      // Do not allow deleting other super_admin accounts
      if (user.role === 'super_admin') {
        return NextResponse.json(
          { error: 'Cannot delete Super Admin accounts' },
          { status: 403 }
        );
      }

      // If recruiter, cascade-delete their companies and candidates to prevent orphan records
      if (user.role === 'recruiter') {
        const userObjId = mongoose.Types.ObjectId.isValid(userId)
          ? new mongoose.Types.ObjectId(userId)
          : userId;

        const companies = await RecruitingCompany.find(
          { $or: [{ createdBy: userId }, { createdBy: userObjId }] },
          { _id: 1 }
        ).lean();
        const companyIds = companies.map((c: any) => c._id);

        await Candidate.deleteMany({
          $or: [
            { createdBy: userId },
            { createdBy: userObjId },
            { companyId: { $in: companyIds } },
          ],
        });

        await RecruitingCompany.deleteMany({
          $or: [{ createdBy: userId }, { createdBy: userObjId }],
        });
      }

      // If client user, also remove from Client collection
      if (user.role === 'client' && user.clientId) {
        await Client.findByIdAndDelete(user.clientId);
      }

      await User.findByIdAndDelete(userId);

      return NextResponse.json(
        { message: `${user.role ? user.role.toUpperCase() : 'User'} deleted successfully` },
        { status: 200 }
      );
    }

    // Check if it's a Client ID from Client collection
    const client = await Client.findById(userId);
    if (client) {
      await User.deleteMany({ clientId: userId });
      await Client.findByIdAndDelete(userId);
      return NextResponse.json(
        { message: 'Client profile and associated login removed successfully' },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
