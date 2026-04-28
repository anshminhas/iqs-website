import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env before importing models
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import Category from './models/Category';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/iqs-dms";

const categories = [
  {
    name: "Registrations",
    subcategories: [
      "Factories License/Shop Act License",
      "ESIC Registration",
      "PF Registration",
      "NOC of Fire",
      "NOC of Pollution",
      "Cess Registration",
      "CLRA Registration",
      "LWF Registration",
      "Professional Tax Registration",
      "FSSAI License (State & Central)"
    ]
  },
  { name: "Payroll Sheet", subcategories: [] },
  { name: "PF Compliance Support & Employee", subcategories: [] },
  { name: "Employees' State Insurance", subcategories: [] },
  { name: "Labour Welfare Fund", subcategories: [] },
  { name: "Child Labour Act", subcategories: [] },
  { name: "Bonus Compliance", subcategories: [] },
  {
    name: "Registers",
    subcategories: [
      "Employee Data",
      "Advances",
      "Overtime/Incentives",
      "Holiday Registers"
    ]
  },
  { name: "Maternity Benefit Act", subcategories: [] },
  { name: "Sexual Harassment Act", subcategories: [] },
  { name: "Contract Labour Management", subcategories: [] },
  { name: "Statutory Register Maintenance", subcategories: [] },
  { name: "Gratuity Compliance Management", subcategories: [] }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database.');

    for (const cat of categories) {
      await Category.updateOne({ name: cat.name }, { $set: cat }, { upsert: true });
    }

    console.log('Successfully seeded 13 compliance categories.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
}

seed();
