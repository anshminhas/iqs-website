'use server';

import connectToDatabase from '@/utils/db';
import Client from '@/models/Client';
import Document from '@/models/Document';
import Category from '@/models/Category';

export async function getClientDashboardData(clientId: string) {
  await connectToDatabase();
  const client = await Client.findById(clientId).populate('assignedCategoryIds');
  if (!client) throw new Error("Client not found");

  const documents = await Document.find({ clientId }).populate('categoryId');

  return {
    client: JSON.parse(JSON.stringify(client)),
    documents: JSON.parse(JSON.stringify(documents))
  };
}
