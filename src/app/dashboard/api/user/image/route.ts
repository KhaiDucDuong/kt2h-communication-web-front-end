import { getAccessToken } from "@/services/AuthService";
import { UserDataOnlyResponse } from "@/types/response";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest
): Promise<
  NextResponse<{ body?: UserDataOnlyResponse; message: string }>
> {
  const formData = await request.formData();
  const image = formData.get("image");
  const accessToken = await getAccessToken(true);

  if (!image)
    return NextResponse.json({ message: "Image is null" }, { status: 400 });

  try {
    console.log(`Sending request to update user's profile image`);
    const result = await fetch(`${process.env.UPDATE_USER_PROFILE_IMAGE}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!result.ok) {
      return NextResponse.json(
        { message: "Failed to update user's profile picture" },
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
