"use server";
import { User } from "@/types/user";
import { getAccessToken, logOut } from "./AuthService";
import { cookies } from "next/headers";
import { refreshTokenCookieName, userSessionCookieName } from "@/utils/constants";

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

export async function getRefreshToken(): Promise<string | null> {
  console.log(`Getting refresh token in cookies`);
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get(refreshTokenCookieName);
  if (!tokenCookie) return null;
  console.log("Refresh token: " + (tokenCookie.value));
  return tokenCookie.value;
}
