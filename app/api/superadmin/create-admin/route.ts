import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();

    return NextResponse.json({ message: 'Admin created successfully', admin: { id: newAdmin._id, name, email } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating admin' }, { status: 500 });
  }
}
