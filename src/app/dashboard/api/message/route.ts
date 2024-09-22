import { getAccessToken } from "@/services/AuthService";
import { ContactResponse, ConversationMessageResponse } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<{ body?: ConversationMessageResponse; message: string }>> {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const conversationId = searchParams.get("conversationId");
  const dataSize = 40;
  const sortBy = "createdDate,desc";
  const accessToken = await getAccessToken(true);

  console.log("Page: ", page);
  if (Number(page) <= 0) {
    return NextResponse.json(
      { message: "Invalid page number" },
      { status: 400 }
    );
  }

  try {
    const result = await fetch(
      `${process.env.FETCH_CONVERSATION_MESSAGES}/${conversationId}?size=${dataSize}&page=${page}&sort=${sortBy}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
            revalidate: 0
        //   revalidate: 300,
        //   tags: [`conversation-${conversationId}`],
        },
      }
    );

    if (!result.ok) {
      return NextResponse.json(
        { message: "Failed to fetch messages in conversation" },
        { status: 400 }
      );
    }

    const data = await result.json();
    console.log("Conversation messages data: ", data);
    return NextResponse.json(data as ConversationMessageResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
