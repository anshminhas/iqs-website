import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// POST /api/superadmin/change-password
// Body: { targetEmail: string, newPassword: string }
// Super admin can change any user's password (or their own)
export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // Auth — super_admin only
    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { targetEmail, newPassword } = await req.json();

    if (!targetEmail || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Find target user
    const targetUser = await User.findOne({ email: targetEmail.toLowerCase().trim() });
    if (!targetUser) {
      return NextResponse.json({ error: 'No user found with this email address' }, { status: 404 });
    }

    // Hash and update
    const hashed = await bcrypt.hash(newPassword, 10);
    targetUser.password = hashed;
    await targetUser.save();

    return NextResponse.json({
      message: `Password updated successfully for ${targetUser.name || targetEmail} (${targetUser.role})`,
    });
  } catch (err: any) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update password' }, { status: 500 });
  }
}
