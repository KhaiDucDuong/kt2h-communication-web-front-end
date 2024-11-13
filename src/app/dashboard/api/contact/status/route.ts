import { getAccessToken } from "@/services/AuthService";
import { ContactResponse, UserStatusReponse } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ body?: ContactResponse; message: string }>> {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("id");
  const accessToken = await getAccessToken(true);
  // const sortBy = "last_message_date";

  if (!userId) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  try {
    const result = await fetch(
      `${process.env.FETCH_USER_STATUS}${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 0,
        },
      }
    );

    if (!result.ok) {
      return NextResponse.json(
        { message: "Failed to fetch user's status" },
        { status: 400 }
      );
    }

    const data = await result.json();
    console.log("User's status data: ", JSON.stringify(data));
    return NextResponse.json(data as UserStatusReponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  // res.end(`Post: ${pid}`)
}
