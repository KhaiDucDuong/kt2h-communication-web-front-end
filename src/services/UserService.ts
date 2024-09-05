"use server";
import { User } from "@/types/user";
import { getAccessToken, logOut } from "./AuthService";
import { cookies } from "next/headers";
import { userSessionCookieName } from "@/utils/constants";

export async function getCurrentUser(): Promise<User | null> {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.log("Faulty access token");
    return null;
  }

  console.log(`Getting current user`);
  const cookieStore = cookies();
  const userCookie = cookieStore.get(userSessionCookieName);
  if (!userCookie) return null;
  console.log("Current user: " + JSON.stringify(JSON.parse(userCookie.value)));
  return JSON.parse(userCookie.value);
}
