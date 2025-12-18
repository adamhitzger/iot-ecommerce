import { cache } from "react";
import { getUserFromSession } from "./session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/types";
import { sanityFetch } from "@/sanity/lib/client";
import { GET_CUR_USER } from "@/sanity/lib/queries";

async function _getCurrentUser({
    withFullUser = false,
    redirectIfNotFound = false,
  }: {
    withFullUser?: boolean;
    redirectIfNotFound?: boolean;
  } = {}): Promise<User | null | undefined> {
    const user = await getUserFromSession(await cookies());
  
    if (user == null) {
      if (redirectIfNotFound) return redirect("/sign-in");
      return null;
    }
  
    if (withFullUser) {
      const fullUser = await getUserFromDB(user);
      if (fullUser == null) throw new Error("User not found in database");
      return fullUser;
    }
  }

  export const getCurrentUser = cache(_getCurrentUser)

async function getUserFromDB(id: string): Promise<User | undefined> {
    const users = await sanityFetch<User[]>({
        query: GET_CUR_USER,
        params: { email: id }
    });

    if (!users || users.length === 0) {
        return undefined;
    }

    const user = users[0];

    return {
        _id: user._id,
        _type: "users",
        event_type: user.event_type,
        email: String(user.email ?? ""),
        name: String(user.name ?? ""),
        surname: String(user.surname ?? ""),
        tel: String(user.tel ?? ""),
        type: user.type ?? "customer",
        ico: user.ico ?? 0,
        souhlas: Boolean(user.souhlas ?? false),
        country: String(user.country ?? ""),
        region: String(user.region ?? ""),
        postalCode: String(user.postalCode ?? ""),
        address: String(user.address ?? ""),
        city: String(user.city ?? "")
    };
}
