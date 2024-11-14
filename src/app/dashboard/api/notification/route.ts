import { getAccessToken } from "@/services/AuthService";
import { InvitationNotificationResponse } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<
  NextResponse<{ body?: InvitationNotificationResponse; message: string }>
> {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const dataSize = 10;
  const sortBy = "createdDate,desc";
  const accessToken = await getAccessToken(true);

  if (Number(page) <= 0) {
    return NextResponse.json(
      { message: "Invalid page number" },
      { status: 400 }
    );
  }

  try {
    console.log(`Fetching invitation notifications at page ${page}`);
    const result = await fetch(
      `${process.env.FETCH_INVITATION_NOTIFICATION}?size=${dataSize}&page=${page}&sort=${sortBy}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 300,
          tags: [`invitationNotifications`],
        },
      }
    );

    if (!result.ok) {
      return NextResponse.json(
        { message: "Failed to fetch invitation notifications" },
        { status: 400 }
      );
    }

    const data = await result.json();
    console.log("Invitation Notification data: ", data);
    return NextResponse.json(data as InvitationNotificationResponse, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
