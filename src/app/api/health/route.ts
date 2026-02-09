import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const result = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      products: result.count,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed',
      },
      { status: 500 }
    );
  }
}
