import { getAccessToken } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const accessToken = await getAccessToken(true);
    if (!accessToken) {
        console.log("Faulty access token");
        return NextResponse.json(
          { message: "Faulty access token" },
          { status: 401 }
        );
      }
      try {
        const res = await fetch(`${process.env.GROUPS_SELECT}?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const response = await res.json();
        console.log("Groupchat list response: " + JSON.stringify(response));
        return NextResponse.json({ response });
      } catch (error) {
        console.log("Error fetching Groupchat list: " + error);
        return NextResponse.json(
          { message: error },
          { status: 500 }
        );
      }
    }