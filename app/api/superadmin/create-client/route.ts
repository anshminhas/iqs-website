import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { companyName, email, password, assignedCategoryIds, logoUrl, address } = await req.json();

    if (!companyName || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const superAdminId = req.headers.get('x-user-id'); // Set by middleware

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = new Client({
      companyName,
      contactEmail: email,
      createdBy: superAdminId,
      assignedCategoryIds: assignedCategoryIds || [],
      logoUrl: logoUrl || '',
      address: address || '',
    });

    await client.save();

    const newClientUser = new User({
      name: companyName,
      email,
      password: hashedPassword,
      role: 'client',
      clientId: client._id,
    });

    await newClientUser.save();

    return NextResponse.json({ message: 'Client created successfully', client: { id: client._id, companyName, email } }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating client' }, { status: 500 });
  }
}
