import { UpdateUserProfileRequestBody } from "@/components/Dashboard/MyProfile/MyProfileEditModal";
import { getAccessToken } from "@/services/AuthService";
import { UserDataOnlyResponse } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest
): Promise<NextResponse<{ body?: UserDataOnlyResponse; message: string }>> {
  const accessToken = await getAccessToken(true);
  if (!request.body)
    return NextResponse.json(
      { message: "Request body from client side is null" },
      { status: 400 }
    );
  const bodyData: UpdateUserProfileRequestBody = await request.json();

  if (!bodyData.first_name || !bodyData.last_name)
    return NextResponse.json(
      { message: "Request body from client side is missing data" },
      { status: 400 }
    );

  try {
    console.log(`Sending request to update user's profile`);
    const result = await fetch(`${process.env.UPDATE_USER_PROFILE}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bodyData),
    });

    if (!result.ok) {
      return NextResponse.json(
        { message: "Failed to update user's profile" },
        { status: 400 }
      );
    }

    const data = await result.json();
    console.log("User Response data: ", data);
    return NextResponse.json(data as UserDataOnlyResponse, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
