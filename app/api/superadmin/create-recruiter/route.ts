import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 });
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRecruiter = new User({
      name,
      email,
      password: hashedPassword,
      role: 'recruiter',
    });

    await newRecruiter.save();

    return NextResponse.json(
      {
        message: 'Recruiter created successfully',
        recruiter: { id: newRecruiter._id, name, email, role: 'recruiter' },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating recruiter' }, { status: 500 });
  }
}
