import { CatProduct } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { productSchema } from '@/schema';
import { apiSuccess, apiError, getErrorMessage } from '@/lib/api-response';

// Function to generate a unique ID for a new product
const generateUniqueId = async () => {
  let isUnique = false;
  let customId = '';

  // Loop until a unique ID is generated
  while (!isUnique) {
    customId = `PRD-${uuidv4().slice(0, 8)}`;
    const existingProduct = await db.productStock.findUnique({
      where: { id: customId },
    });

    if (!existingProduct) {
      isUnique = true;
    }
  }

  return customId;
};

// Handler function for POST request to create a new product
export const POST = async (request: Request) => {
  try {
    const customId = await generateUniqueId();
    const body = await request.json();

    // Validate request body with Zod schema
    const validationResult = productSchema.safeParse({
      productName: body.productName,
      buyPrice: body.buyPrice,
      sellPrice: body.sellPrice,
      stockProduct: body.stockProduct,
      category: body.category,
    });

    if (!validationResult.success) {
      return apiError(
        validationResult.error.errors.map((e) => e.message).join(', '),
        400
      );
    }

    // Create a new product with the generated ID and validated data
    const newProduct = await db.productStock.create({
      data: {
        id: customId,
        name: body.productName,
        stock: body.stockProduct,
        price: body.buyPrice,
        cat: body.category as CatProduct,
        Product: {
          create: {
            sellprice: body.sellPrice,
          },
        },
      },
    });

    return apiSuccess(newProduct, 201);
  } catch (error) {
    return apiError(getErrorMessage(error));
  }
};
