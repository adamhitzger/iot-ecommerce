import { NextResponse, type NextRequest } from "next/server"
import {
  getUserFromSession,
  updateUserSessionExpiration,
} from "./auth/session"

export async function proxy(request: NextRequest) {
  const response = (await middlewareAuth(request)) ?? NextResponse.next()
  
  await updateUserSessionExpiration({
    set: (key, value, options) => {
      response.cookies.set({ ...options, name: key, value })
    },
    get: key => request.cookies.get(key),
  })

  return response
}

async function middlewareAuth(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/user" ||  path === "/user") {
    const user = await getUserFromSession(request.cookies)
    if (user == null) {
      return NextResponse.redirect(new URL("/signin", request.url))
    }
  }

}

export const config = {
  matcher: [
    '/((?!_next|api/webhook/stripe|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}