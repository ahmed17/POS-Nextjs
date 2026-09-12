export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Handler function for GET requests
export async function GET(req: NextRequest) {
  try {
    // Get the top 5 products with the highest total quantity sold
    const topProducts = await db.onSaleProduct.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Get detailed information for each top product
    const productDetails = await Promise.all(
      topProducts.map(async (product) => {
        const productDetail = await db.product.findUnique({
          where: {
            id: product.productId,
          },
        });
        return {
          ...productDetail,
          _sum: product._sum,
        };
      })
    );

    // Return the top products with their details as a JSON response with a 200 status code
    return NextResponse.json({ topProducts: productDetails }, { status: 200 });
  } catch (error) {
    // Log and return an error message as a JSON response with a 500 status code if there's an error
    console.error('Error occurred:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
