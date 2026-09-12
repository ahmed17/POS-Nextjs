import { CatProduct } from '@prisma/client';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Handler function for PATCH request
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();

    // Update the product details and related product information
    const editProduct = await db.product.update({
      where: {
        id: String(params.id),
      },
      data: {
        name: body.productName,
        stock: body.stockProduct,
        price: body.buyPrice,
        sellprice: body.sellPrice,
        cat: body.category as CatProduct,
      },
    });

    // Return the updated product in the response
    return NextResponse.json(editProduct, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

// Handler function for DELETE request
export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Delete the product with the specified id
    const product = await db.product.delete({
      where: {
        id: String(params.id),
      },
    });

    // Return a success message in the response
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
