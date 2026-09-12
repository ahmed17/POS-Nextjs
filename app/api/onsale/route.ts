import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { apiSuccess, apiError, getErrorMessage } from '@/lib/api-response';

// Handler function for POST request
export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.productId || !body.transactionId || !body.qTy) {
      return apiError('productId, transactionId, and qTy are required', 400);
    }

    // Check stock availability before creating/updating the sale
    const productStock = await db.productStock.findUnique({
      where: { id: body.productId },
    });

    if (!productStock) {
      return apiError('Product not found', 404);
    }

    if (productStock.stock < body.qTy) {
      return apiError(
        `Insufficient stock. Available: ${productStock.stock}, Requested: ${body.qTy}`,
        400
      );
    }

    // Use a transaction to ensure atomicity: create/update sale AND reduce stock
    const result = await db.$transaction(async (tx) => {
      // Check if a product with the same productId and transactionId already exists
      const existingOrderProduct = await tx.onSaleProduct.findFirst({
        where: {
          productId: body.productId,
          transactionId: body.transactionId,
        },
      });

      let onSaleProduct;

      if (existingOrderProduct) {
        // If it exists, update the quantity by adding the new quantity
        onSaleProduct = await tx.onSaleProduct.update({
          where: {
            id: existingOrderProduct.id,
          },
          data: {
            quantity: existingOrderProduct.quantity + body.qTy,
          },
        });
      } else {
        // If it doesn't exist, create a new sale product
        onSaleProduct = await tx.onSaleProduct.create({
          data: {
            transactionId: body.transactionId,
            productId: body.productId,
            quantity: body.qTy,
          },
        });
      }

      // Reduce the stock atomically
      await tx.productStock.update({
        where: { id: body.productId },
        data: { stock: { decrement: body.qTy } },
      });

      return onSaleProduct;
    });

    // Return the created or updated product in the response
    return apiSuccess(result, 201);
  } catch (error) {
    return apiError(getErrorMessage(error));
  }
};
