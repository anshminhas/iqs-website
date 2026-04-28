'use server';

import connectToDatabase from '@/utils/db';
import User from '@/models/User';
import Client from '@/models/Client';
import Document from '@/models/Document';
import Category from '@/models/Category';
import ActivityLog from '@/models/ActivityLog';
import { revalidatePath } from 'next/cache';

export async function getAdminData(adminId: string) {
  await connectToDatabase();
  const admin = await User.findById(adminId).populate('assignedClients');
  if (!admin) throw new Error("Admin not found");
  return JSON.parse(JSON.stringify(admin.assignedClients));
}

export async function getClientWorkspaceData(clientId: string, adminId: string) {
  await connectToDatabase();
  const client = await Client.findById(clientId).populate('assignedCategoryIds');
  const documents = await Document.find({ clientId }).sort({ createdAt: -1 });

  return {
    client: JSON.parse(JSON.stringify(client)),
    documents: JSON.parse(JSON.stringify(documents))
  };
}

export async function uploadDocumentVersion(data: {
  clientId: string, categoryId: string, subcategory?: string, month: string,
  url: string, public_id: string, adminId: string, remarks?: string
}) {
  await connectToDatabase();

  const newVersion = {
    url: data.url,
    public_id: data.public_id,
    version: 1, // To be calculated
    uploadedBy: data.adminId,
    remarks: data.remarks
  };

  let doc = await Document.findOne({
    clientId: data.clientId,
    categoryId: data.categoryId,
    subcategory: data.subcategory || '',
    month: data.month
  });

  if (doc) {
    newVersion.version = doc.version + 1;
    doc.version = newVersion.version;
    doc.file = { url: data.url, public_id: data.public_id };
    doc.history.push(newVersion);
    await doc.save();
  } else {
    doc = new Document({
      clientId: data.clientId,
      categoryId: data.categoryId,
      subcategory: data.subcategory || '',
      month: data.month,
      status: 'pending',
      file: { url: data.url, public_id: data.public_id },
      version: 1,
      history: [newVersion]
    });
    await doc.save();
  }

  // Audit Log
  await ActivityLog.create({
    adminId: data.adminId,
    targetId: doc._id,
    action: 'DOC_UPLOAD',
    description: `Uploaded version ${newVersion.version} for document in ${data.month}`
  });

  revalidatePath(`/dashboard/admin/client/${data.clientId}`);
  return { success: true, document: JSON.parse(JSON.stringify(doc)) };
}
