import { getAccessToken } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const accessToken = await getAccessToken(false);

  if (!accessToken) {
    console.log("Faulty access token");
    return NextResponse.json(
      { message: "Faulty access token" },
      { status: 401 }
    );
  }

  const dataSize = 20;
  console.log(`Fetching friend list at page ${page}`);
  try {
    const res = await fetch(
      `${process.env.FETCH_FRIEND_LIST}?size=${dataSize}&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const body = await res.json();
    console.log("Friend list response: " + JSON.stringify(body));
    return NextResponse.json({ body });
  } catch (error) {
    console.log("Error fetching user friend list: " + error);
    return NextResponse.json(
      { message: error },
      { status: 500 }
    );
  }
}
