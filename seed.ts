import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

// Load env before importing models
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import Category from './models/Category';
import User from './models/User';

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

const superAdmins = [
  {
    name: "Vikrant",
    email: "vikrant2003aug06@gmail.com",
    password: "123456",
    role: "super_admin"
  },
  {
    name: "IQS Info",
    email: "info@iqsindia.in",
    password: "123456",
    role: "super_admin"
  }
];

async function seed() {
  try {
    console.log('Connecting to database:', MONGODB_URI.split('@')[1] || MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database.');

    // 1. Seed Categories
    for (const cat of categories) {
      await Category.updateOne({ name: cat.name }, { $set: cat }, { upsert: true });
    }
    console.log(`Successfully seeded ${categories.length} compliance categories.`);

    // 2. Seed Super Admins
    for (const admin of superAdmins) {
      const hashedPassword = bcrypt.hashSync(admin.password, 10);
      await User.updateOne(
        { email: admin.email },
        { 
          $set: { 
            name: admin.name,
            password: hashedPassword,
            role: admin.role
          } 
        },
        { upsert: true }
      );
      console.log(`SuperAdmin seeded/updated: ${admin.email}`);
    }

    console.log('Seeding completed successfully.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Seeding failed', error);
    process.exit(1);
  }
}

seed();
