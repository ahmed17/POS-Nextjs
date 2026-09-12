import { PrismaClient } from '@prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

import { db } from '../db';

vi.mock('../db', () => ({
  __esModule: true,
  db: mockDeep<PrismaClient>(),
}));

export const dbMock = db as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(dbMock);
});
