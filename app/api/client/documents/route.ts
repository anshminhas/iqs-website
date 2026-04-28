import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/db';
import DocModel from '@/models/Document';
import Client from '@/models/Client';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/jwt';

// Ensure Category model is registered for populate()
import '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get('dms_auth')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload: any = await verifyToken(token);
    if (!payload || payload.role !== 'client') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let clientId = payload.clientId;
    
    if (!clientId) {
      console.log(`No clientId in token for ${payload.email}, searching for matching Client record...`);
      const client = await Client.findOne({ contactEmail: payload.email });
      if (client) {
        clientId = client._id;
        console.log(`Found linked client: ${client.companyName} (${clientId})`);
      }
    }

    if (!clientId) {
      console.error(`No client linked to account: ${payload.email}`);
      return NextResponse.json({ error: 'No client linked to account' }, { status: 400 });
    }

    const documents = await DocModel.find({ clientId })
      .populate('categoryId', 'name')
      .sort({ month: -1, createdAt: -1 });

    const monthlyMap: Record<string, any> = {};
    const registrations: any[] = [];
    const statutory: any[] = [];

    // Category mapping groups
    const MONTHLY_CATS = [
      'Payroll Sheet',
      "Employees' State Insurance",
      'PF Compliance Support & Employee'
    ];

    const STATUTORY_CATS = [
      'Labour Welfare Fund',
      'Child Labour Act',
      'Bonus Compliance',
      'Registers',
      'Maternity Benefit Act',
      'Sexual Harassment Act',
      'Contract Labour Management',
      'Statutory Register Maintenance',
      'Gratuity Compliance Management'
    ];

    documents.forEach((doc: any) => {
      const catName = doc.categoryId?.name;
      // Normalize month to YYYY-MM to ensure grouping by month even if day varies
      const month = doc.month ? doc.month.substring(0, 7) : 'Unknown';

      if (catName === 'Registrations') {
        registrations.push(doc);
      } else if (MONTHLY_CATS.includes(catName)) {
        // Monthly Compliance Logic (Strict 3)
        if (!monthlyMap[month]) {
          monthlyMap[month] = {
            month,
            status: 'Completed',
            documents: { payroll: null, esi: null, pf: null }
          };
        }

        if (catName === 'Payroll Sheet') {
          monthlyMap[month].documents.payroll = doc;
        } else if (catName === "Employees' State Insurance") {
          monthlyMap[month].documents.esi = doc;
        } else if (catName === "PF Compliance Support & Employee") {
          monthlyMap[month].documents.pf = doc;
        }
      } else if (STATUTORY_CATS.includes(catName)) {
        statutory.push(doc);
      }
    });

    const monthly = Object.values(monthlyMap).sort((a: any, b: any) => 
      b.month.localeCompare(a.month)
    );

    return NextResponse.json({ monthly, registrations, statutory }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching documents' }, { status: 500 });
  }
}
