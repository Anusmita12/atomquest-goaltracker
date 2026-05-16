import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ 
      success: false, 
      message: 'DATABASE_URL is not defined. Please add it to your environment variables.' 
    }, { status: 500 });
  }
  try {
    // Attempt to fetch the count of profiles we seeded earlier
    const result = await sql`SELECT COUNT(*) FROM profiles`;
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Neon!',
      count: result[0].count 
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
