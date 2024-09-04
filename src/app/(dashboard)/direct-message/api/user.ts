import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/services/AuthService";
import { cookies } from "next/headers";
import { userSessionCookieName } from "@/utils/constants";

export async function GET(request: NextRequest) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      console.log("Faulty access token");
      return NextResponse.json(
        { message: "Faulty access token" },
        { status: 500 }
      );
    }

    console.log(`Getting current user`);
    const cookieStore = cookies();
    const userCookie = cookieStore.get(userSessionCookieName);
    if(!userCookie) { 
      return NextResponse.json({ message: "No user cookie found" }, { status: 401 });
    } else {
      return NextResponse.json(JSON.parse(userCookie.value));
    }
  }