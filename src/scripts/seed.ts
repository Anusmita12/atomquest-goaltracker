import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  try {
    console.log('--- Starting Database Seeding (Neon) ---');

    // DROP existing tables to ensure clean schema for the demo
    console.log('Cleaning up existing tables...');
    await sql`DROP TABLE IF EXISTS goals CASCADE;`;
    await sql`DROP TABLE IF EXISTS profiles CASCADE;`;

    // 1. Create Profiles Table (aligned with mock-data)
    console.log('Creating profiles table...');
    await sql`
      CREATE TABLE profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        department TEXT,
        manager_id TEXT,
        role TEXT NOT NULL,
        overall_score INTEGER DEFAULT 0,
        last_activity TEXT
      );
    `;

    // 2. Create Goals Table
    console.log('Creating goals table...');
    await sql`
      CREATE TABLE goals (
        id TEXT PRIMARY KEY,
        employee_id TEXT REFERENCES profiles(id),
        thrust_area TEXT,
        title TEXT NOT NULL,
        uom TEXT,
        unit TEXT,
        target_value TEXT,
        weightage INTEGER,
        status TEXT,
        deadline TEXT,
        q1 TEXT,
        q2 TEXT,
        q3 TEXT,
        score INTEGER DEFAULT 0
      );
    `;

    // 3. Seed Initial Profiles
    console.log('Seeding initial profiles...');
    const profiles = [
      ['e1', 'Priya Sharma', 'employee@demo.com', 'Engineering', 'm1', 'employee', 86, '12 May 2026'],
      ['e2', 'Arjun Mehta', 'arjun@demo.com', 'Sales', 'm1', 'employee', 95, '13 May 2026'],
      ['e3', 'Neha Kapoor', 'neha@demo.com', 'Operations', 'm1', 'employee', 67, '10 May 2026'],
      ['m1', 'Rahul Bose', 'manager@demo.com', 'Management', 'a1', 'manager', 0, '15 May 2026'],
      ['a1', 'Sneha Iyer', 'admin@demo.com', 'HR', null, 'admin', 0, '1 May 2026'],
    ];

    for (const p of profiles) {
      await sql`
        INSERT INTO profiles (id, name, email, department, manager_id, role, overall_score, last_activity)
        VALUES (${p[0]}, ${p[1]}, ${p[2]}, ${p[3]}, ${p[4]}, ${p[5]}, ${p[6]}, ${p[7]})
      `;
    }

    console.log('--- Seeding Completed Successfully ---');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
