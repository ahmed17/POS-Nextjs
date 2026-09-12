import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Handler function for GET request
export async function GET(req: NextRequest) {
  try {
    // Aggregate total stock
    const totalStock = await db.productStock.aggregate({
      _sum: {
        stock: true,
      },
    });

    // Aggregate total amount
    const totalAmount = await db.transaction.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    // Aggregate total quantity
    const totalQuantity = await db.onSaleProduct.aggregate({
      _sum: {
        quantity: true,
      },
    });

    // Return aggregated data in the response
    return NextResponse.json(
      { totalStock, totalAmount, totalQuantity },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors
    console.error(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
