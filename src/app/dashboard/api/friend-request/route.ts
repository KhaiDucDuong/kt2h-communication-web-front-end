import { getAccessToken } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let page = searchParams.get("page");
  const type = searchParams.get("type");
  const accessToken = await getAccessToken(false);

  if (!accessToken) {
    console.log("Faulty access token");
    return;
  }

  if (!page) {
    page = "1";
  }

  if (type === "INCOMING") {
    return fetchIncomingRequest(page, accessToken);
  } else if (type === "OUTGOING") {
    return fetchOutgoingRequest(page, accessToken);
  } else {
    console.log(`Invalid request type ${type}`);
    return;
  }
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let id = searchParams.get("id");
  let status = searchParams.get("status");
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.log("Faulty access token");
    return;
  }

  const requestBodyData = {
    "id": id,
    "status": status
  }

  console.log(`Updating friend request ${id} with new status ${status}`);
  try {
    const res = await fetch(
      `${process.env.UPDATE_FRIEND_REQUEST_STATUS}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBodyData)
      }
    );

    if(res.status === 200){
      revalidateTag("incomingFriendRequests")
      revalidateTag("conversations")
      console.log("Revalidate `incomingFriendRequests` & `conversations` tag")
      return NextResponse.json({message: "ok"});
    }
    return NextResponse.error();
  } catch (error) {
    console.log("Error updating friend request status: " + error);
    return;
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let id = searchParams.get("id");
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.log("Faulty access token");
    return;
  }

  const requestBodyData = {
    "id": id
  }

  console.log(`Delete friend request ${id}`);
  try {
    const res = await fetch(
      `${process.env.DELETE_FRIEND_REQUEST}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBodyData)
      }
    );

    if(res.status === 200){
      revalidateTag("outgoingFriendRequests")
      console.log("Revalidate `outgoingFriendRequests` tag")
      return NextResponse.json({message: "ok"});
    }
    return NextResponse.error();
  } catch (error) {
    console.log("Error Deleting friend request: " + error);
    return;
  }
}

async function fetchIncomingRequest(page: string, accessToken: string) {
  const dataSize = 20;
  console.log(`Fetching incoming friend requests at page ${page}`);
  try {
    const res = await fetch(
      `${process.env.FETCH_INCOMING_FRIEND_REQUEST}?size=${dataSize}&page=${page}&sort=createdDate,asc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 60,
          tags: ["incomingFriendRequests"]
        },
      }
    );
    const body = await res.json();
    console.log("Incoming friend requests response: " + JSON.stringify(body));
    return NextResponse.json({ body });
  } catch (error) {
    console.log("Error fetching user incoming friend requests: " + error);
    return NextResponse.error();
  }
}

async function fetchOutgoingRequest(page: string, accessToken: string) {
  const dataSize = 20;
  console.log(`Fetching outgoing friend requests at page ${page}`);
  try {
    const res = await fetch(
      `${process.env.FETCH_OUTGOING_FRIEND_REQUEST}?size=${dataSize}&page=${page}&sort=createdDate,asc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: {
          revalidate: 60,
          tags: ["outgoingFriendRequests"]
        },
      }
    );
    const body = await res.json();
    console.log("Outgoing friend requests response: " + JSON.stringify(body));
    return NextResponse.json({ body });
  } catch (error) {
    console.log("Error fetching user outgoing friend requests: " + error);
    return NextResponse.error();
  }
}
