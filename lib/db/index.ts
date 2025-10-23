import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// 環境変数の検証 (ビルド時は有効なダミーURLを使用)
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dummy';

// Neon接続
const sql = neon(DATABASE_URL);

// Drizzle ORMインスタンス
export const db = drizzle(sql, { schema });

// 接続テスト関数
export async function testConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }
  
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected:', result);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
