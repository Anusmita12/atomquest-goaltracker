import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL && process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const dbUrl = process.env.DATABASE_URL || '';
const sql = neon(dbUrl);

/**
 * Executes a query with an RLS session context.
 * 
 * @param userId - The UUID of the user to set as the session context
 * @param queryFn - A function that receives the sql client and returns a promise
 * 
 * Example usage:
 * const goals = await withAuth(userId, (db) => db`SELECT * FROM goals`);
 */
export async function withAuth<T>(userId: string, queryFn: (db: typeof sql) => Promise<T>): Promise<T> {
  // In Neon, we simulate RLS context by setting a session variable within a transaction
  // However, the standard neon() client is one-shot. 
  // For true RLS, we'd use the transaction-capable client.
  // For this hackathon demo, we'll implement a simple wrapper.
  
  // Note: For a real production app, you'd use a transaction here.
  // This helper is a placeholder to show where RLS context is handled.
  return queryFn(sql);
}

export default sql;
