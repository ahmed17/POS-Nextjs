import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    // Parse the request body as JSON
    const body = await request.json();

    // Update the store name if 'storeName' is in the body
    if ('storeName' in body) {
      const updatedStorename = await db.shopData.update({
        where: {
          id: String(params.id),
        },
        data: {
          name: body.storeName,
        },
      });
      return NextResponse.json(updatedStorename, { status: 201 });
    }

    // Update the store tax if 'tax' is in the body
    if ('tax' in body) {
      const updatedStoretax = await db.shopData.update({
        where: {
          id: String(params.id),
        },
        data: {
          tax: body.tax,
        },
      });
      return NextResponse.json(updatedStoretax, { status: 201 });
    }

    // If neither 'shopName' nor 'tax' is in the body, return an error
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
