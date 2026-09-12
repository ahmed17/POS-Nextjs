import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Handler function for GET request to fetch product stocks
export async function GET() {
  try {
    const productStocks = await db.product.findMany();

    // Return the product stocks in the response
    return NextResponse.json(productStocks, { status: 200 });
  } catch (error) {
    // Handle errors if fetching product stocks fails
    return NextResponse.json(
      { error: 'Failed to fetch product stocks' },
      { status: 500 }
    );
  }
}
