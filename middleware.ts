import type { NextRequest } from 'next/server';
import { nextMiddleware } from '@netlify/next';

type MiddlewareResponse = Awaited<ReturnType<typeof nextMiddleware>>;

type NextMiddleware = (request: NextRequest) => MiddlewareResponse;

type NextMiddlewareWithOptionalRequest = (request?: NextRequest) => MiddlewareResponse;

type ExportedMiddleware = NextMiddleware | NextMiddlewareWithOptionalRequest;

const middleware: ExportedMiddleware = (request?: NextRequest) => {
  return nextMiddleware(request);
};

export default middleware;

export const config = {
  matcher: ['/((?!_next/|.*\..*).*)', '/', '/(api|trpc)(.*)']
};
