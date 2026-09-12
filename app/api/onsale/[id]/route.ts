import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Handler function for PATCH request
export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const body = await request.json();

    // Update the quantity of the order product with the specified id
    const editedOrderProduct = await db.onSaleProduct.update({
      where: {
        id: String(params.id),
      },
      data: {
        quantity: body.qTy,
      },
    });

    // Return the updated order product in the response
    return NextResponse.json(editedOrderProduct, { status: 201 });
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
    // Delete the order product with the specified id
    const deletedOrderProduct = await db.onSaleProduct.delete({
      where: {
        id: String(params.id),
      },
    });

    // Return a success message in the response
    return NextResponse.json(deletedOrderProduct, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
