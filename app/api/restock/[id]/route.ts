import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Parse the request body as JSON
    const body = await request.json();

    // Get the current stock of the product
    const currentProduct = await db.productStock.findUnique({
      where: {
        id: String(params.id),
      },
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate the new stock by adding the body's stockProduct to the current stock
    const newStock = currentProduct.stock + body.stockProduct;

    // Update the product's stock
    const updatedProduct = await db.productStock.update({
      where: {
        id: String(params.id),
      },
      data: {
        stock: newStock,
      },
    });

    // Return the updated product in the response
    return NextResponse.json(updatedProduct, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
