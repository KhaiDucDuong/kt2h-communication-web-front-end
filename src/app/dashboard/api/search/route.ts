import { getAccessToken } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const currentId = searchParams.get('currentId');
    const accessToken = await getAccessToken(true);
    if (!accessToken) {
        console.log("Faulty access token");
        return NextResponse.json(
          { message: "Faulty access token" },
          { status: 401 }
        );
      }
      try {
        const res = await fetch(`${process.env.SEARCH_USER}?username=${username}&currentId=${currentId}`,
          {
            method: "GET",
            headers: {
                
              Authorization: `Bearer ${accessToken}`,
            } 
          }
        );
        const response = await res.json();
        return NextResponse.json({ response });
      } catch (error) {
        console.log("Error fetching Search user list: " + error);
        return NextResponse.json(
          { message: error },
          { status: 500 }
        );
      }
    }