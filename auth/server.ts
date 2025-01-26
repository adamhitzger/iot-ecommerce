import { User } from '@/types'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createSupabaseClient(deleteAccount: "" | "deleteAccount" = "") {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    deleteAccount === "deleteAccount"
    ? process.env.SUPABASE_SERVICE_ROLE!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          
          }
        },
      },
    }
  )
}

export async function getAuth() {
  const { auth } = await createSupabaseClient();
  return auth;
}

export async function getUser(): Promise<User> {
  let dbUser;
    const {auth} = await createSupabaseClient();
    const supabase = await createSupabaseClient();
    const authUser = (await auth.getUser()).data.user;
    if(authUser){
      dbUser = await supabase.from("profiles").select().eq("id", authUser.id).single();
    }
    if (!dbUser) return null; 
    else if(dbUser && authUser) return{
      id: dbUser.data.id,
      email: authUser.email as string,
      first_name: dbUser.data.first_name,
      last_name: dbUser.data.last_name,
      type: dbUser.data.type,
      ico: dbUser.data.ico,
      sanity_id: dbUser.data.sanity_id
    }
}

export async function protectedRoute() {
    const user = await getUser();
    if (!user) throw Error("Unauthorized");
}