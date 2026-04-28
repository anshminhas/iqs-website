import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching categories' }, { status: 500 });
  }
}
