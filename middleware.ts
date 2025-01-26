import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './auth/middleware'
import { getUser } from './auth/server';
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })
  const path = new URL(request.url).pathname;

  const protectedRoutes = ["/user"];
  const authRoutes = ["/signin", "/signup", "/update-pass"];

  const isProtectedRoute = protectedRoutes.some(route =>
    route === path
  );
  const isAuthRoute = authRoutes.includes(path);

  if (isProtectedRoute || isAuthRoute) {
    const user = await getUser();

    if (isProtectedRoute && !user) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}