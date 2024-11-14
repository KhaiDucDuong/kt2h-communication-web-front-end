"use server";

import { SendFriendRequestMessage } from "@/components/Friends/FriendRequests/AddFriend";
import {
  FriendRequestResponse,
  sendFriendRequestSchema,
} from "@/types/friendrequest";
import { getAccessToken } from "@/services/AuthService";
import { revalidateTag } from "next/cache";

export async function sendFriendRequest(
  prevState: SendFriendRequestMessage,
  formData: FormData
): Promise<SendFriendRequestMessage> {
  const schema = sendFriendRequestSchema;

  const data = {
    receiver_username: formData.get("receiver_username"),
  };

  const parse = schema.safeParse(data);

  if (!parse.success) {
    const parseResult = parse.error.flatten().fieldErrors;
    console.log("Form data parsed result: " + parseResult);
    return {
      message: parseResult.receiver_username,
      isSuccess: false,
    };
  }

  const accessToken = await getAccessToken(false);

  if (!accessToken) {
    console.log("Faulty access token");
    return {
      message: ["Faulty access token"],
      isSuccess: false,
    };
  }

  const bodyData = parse.data;
  console.log("Send friend request Form data: " + bodyData);

  try {
    const response = await fetch(`${process.env.SEND_FRIEND_REQUEST}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bodyData),
      cache: "no-cache",
    });

    const result: FriendRequestResponse = await response.json();
    console.log("Response result: " + JSON.stringify(result));
    if (result.statusCode === 200) {
      revalidateTag("outgoingFriendRequests");
      return {
        message: [result.message],
        isSuccess: true,
      };
    }
    return { message: result.error, isSuccess: false };
  } catch (error) {
    console.log("Error sending friend request: " + error);
    return {
      message: ["Something went wrong: " + error],
      isSuccess: false,
    };
  }
}
