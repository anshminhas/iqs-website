import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '@/utils/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      clientId: user.clientId?.toString() || null,
    };

    const token = await signToken(payload);

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'dms_auth',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ user: payload }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
