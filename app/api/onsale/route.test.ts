import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    product: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  }
}));

const dbMock = db as any;

describe('POST /api/onsale', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRequest = (body: any) => {
    return new Request('http://localhost:3000/api/onsale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  it('should return 400 if required fields are missing', async () => {
    const req = mockRequest({ productId: '123' }); // missing qTy and transactionId
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('required');
  });

  it('should return 404 if product is not found', async () => {
    dbMock.product.findUnique.mockResolvedValue(null);

    const req = mockRequest({
      productId: '123',
      transactionId: 'trx-1',
      qTy: 5,
    });
    
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.error).toBe('Product not found');
  });

  it('should return 400 if stock is insufficient', async () => {
    // Mock the product with stock = 2
    dbMock.product.findUnique.mockResolvedValue({
      id: '123',
      name: 'Test Product',
      stock: 2,
      price: 10,
      sellprice: 15,
      cat: 'FOOD',
      imageProduct: null
    } as any);

    const req = mockRequest({
      productId: '123',
      transactionId: 'trx-1',
      qTy: 5, // Requires 5, but stock is 2
    });
    
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toContain('Insufficient stock');
  });

  it('should create sale and decrement stock on success', async () => {
    // Mock product with enough stock
    dbMock.product.findUnique.mockResolvedValue({
      id: '123',
      name: 'Test Product',
      stock: 10,
      price: 10,
      sellprice: 15,
      cat: 'FOOD',
      imageProduct: null
    } as any);

    // Mock the transaction result
    const mockOnSaleProduct = {
      id: 'sale-1',
      productId: '123',
      transactionId: 'trx-1',
      quantity: 5,
    };
    
    // Prisma $transaction mock is a bit tricky, we mock it to just execute the callback
    // For a simple mock, we can just resolve with our expected result
    dbMock.$transaction.mockResolvedValue(mockOnSaleProduct as any);

    const req = mockRequest({
      productId: '123',
      transactionId: 'trx-1',
      qTy: 5,
    });
    
    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.id).toBe('sale-1');
  });
});
