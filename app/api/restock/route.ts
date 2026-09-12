import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError, getErrorMessage } from '@/lib/api-response';

// Handler function for POST request to update a specific product's stock
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Validate the required fields
    if (!body.productId || typeof body.productId !== 'string') {
      return apiError('productId is required and must be a string', 400);
    }

    if (typeof body.stock !== 'number' || body.stock < 1) {
      return apiError('stock is required and must be a positive number', 400);
    }

    // Find the specific product
    const product = await db.productStock.findUnique({
      where: { id: body.productId },
    });

    if (!product) {
      return apiError('Product not found', 404);
    }

    // Update the specific product's stock
    const updatedProduct = await db.productStock.update({
      where: { id: body.productId },
      data: { stock: product.stock + body.stock },
    });

    return apiSuccess(
      { message: `Updated stock for product ${product.name}`, data: updatedProduct },
      200
    );
  } catch (error) {
    return apiError(getErrorMessage(error));
  }
};
