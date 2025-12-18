import { z } from "zod"
import crypto from "crypto"
import redis from "./redis"

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = "session-id"

const sessionSchemaId = z.string()

type UserSession = z.infer<typeof sessionSchemaId>

export type Cookies = {
    set: (
      key: string,
      value: string,
      options: {
        secure?: boolean
        httpOnly?: boolean
        sameSite?: "strict" | "lax"
        expires?: number
      }
    ) => void
    get: (key: string) => { name: string; value: string } | undefined
    delete: (key: string) => void
  }

  function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
    })
  }

  export async function createUserSession(
    user: UserSession,
    cookies: Pick<Cookies, "set">
  ) {
    const sessionId = crypto.randomBytes(512).toString("hex").normalize()
    await redis.set(`session:${sessionId}`, sessionSchemaId.parse(user), {
      ex: SESSION_EXPIRATION_SECONDS,
    })
  
    setCookie(sessionId, cookies)
  }

  export async function updateUserSessionData(
    user: UserSession,
    cookies: Pick<Cookies, "get">
  ) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
  
    await redis.set(`session:${sessionId}`, sessionSchemaId.parse(user), {
      ex: SESSION_EXPIRATION_SECONDS,
    })
  }

  export function getUserFromSession(cookies: Pick<Cookies, "get">) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
  
    return getUserSessionById(sessionId)
  }

  export async function updateUserSessionExpiration(
    cookies: Pick<Cookies, "get" | "set">
  ) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
  
    const user = await getUserSessionById(sessionId)
    if (user == null) return
  
    await redis.set(`session:${sessionId}`, user, {
      ex: SESSION_EXPIRATION_SECONDS,
    })
    setCookie(sessionId, cookies)
  }

  export async function removeUserFromSession(
    cookies: Pick<Cookies, "get" | "delete">
  ) {
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    if (sessionId == null) return null
  
    await redis.del(`session:${sessionId}`)
    cookies.delete(COOKIE_SESSION_KEY)
  }

  async function getUserSessionById(sessionId: string) {
    const rawUser = await redis.get(`session:${sessionId}`)
  
    const { success, data: user } = sessionSchemaId.safeParse(rawUser)
  
    return success ? user : null
  }

