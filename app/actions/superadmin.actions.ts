'use server';

import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';
import Category from '@/models/Category';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

// User & Client Management
export async function createAdmin(data: { name: string, email: string, passwordHash: string }) {
  await connectToDatabase();
  const admin = new User({ ...data, password: data.passwordHash, role: 'admin' });
  await admin.save();
  revalidatePath('/dashboard/superadmin');
  return { success: true, admin: JSON.parse(JSON.stringify(admin)) };
}

export async function createClient(data: { companyName: string, contactEmail: string, logoUrl?: string, createdBy: string }) {
  await connectToDatabase();
  const client = new Client(data);
  await client.save();
  revalidatePath('/dashboard/superadmin');
  return { success: true, client: JSON.parse(JSON.stringify(client)) };
}

export async function assignClientToAdmin(adminId: string, clientId: string) {
  await connectToDatabase();
  const admin = await User.findById(adminId);
  const client = await Client.findById(clientId);
  
  if (!admin || !client) throw new Error("Admin or Client not found");

  if (!admin.assignedClients.includes(clientId)) {
    admin.assignedClients.push(clientId);
    await admin.save();
  }

  if (!client.assignedAdminIds.includes(adminId)) {
    client.assignedAdminIds.push(adminId);
    await client.save();
  }

  revalidatePath('/dashboard/superadmin');
  return { success: true };
}

export async function getSuperAdminData() {
  await connectToDatabase();
  const admins = await User.find({ role: 'admin' }).populate('assignedClients', 'companyName');
  const clients = await Client.find().populate('assignedAdminIds', 'name');
  const categories = await Category.find();
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50).populate('adminId', 'name');
  
  return {
    admins: JSON.parse(JSON.stringify(admins)),
    clients: JSON.parse(JSON.stringify(clients)),
    categories: JSON.parse(JSON.stringify(categories)),
    logs: JSON.parse(JSON.stringify(logs))
  };
}

export async function updateClientCategories(clientId: string, categoryIds: string[]) {
  await connectToDatabase();
  await Client.findByIdAndUpdate(clientId, { assignedCategoryIds: categoryIds });
  revalidatePath('/dashboard/superadmin');
  return { success: true };
}
