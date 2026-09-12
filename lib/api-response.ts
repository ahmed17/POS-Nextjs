import { NextResponse } from 'next/server';

/**
 * Standardized API success response
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Standardized API error response
 * Never exposes raw error messages in production
 */
export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Safely extracts an error message from an unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Checks if a Prisma error has a specific error code
 */
export function isPrismaError(error: unknown, code: string): boolean {
  return (
    error instanceof Error &&
    'code' in error &&
    (error as { code: string }).code === code
  );
}
