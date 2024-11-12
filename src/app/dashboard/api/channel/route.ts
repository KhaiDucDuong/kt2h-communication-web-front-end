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
        const res = await fetch(`${process.env.CHANNELS_SELECT}?groupid=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            } ,
          }
        );
        const response = await res.json();
        return NextResponse.json({ response });
      } catch (error) {
        console.log("Error fetching Groupchat list: " + error);
        return NextResponse.json(
          { message: error },
          { status: 500 }
        );
      }
    }

export async function POST(request: NextRequest){
      const accessToken = await getAccessToken(true);
        if (!accessToken) {
            console.log("Faulty access token");
            return NextResponse.json(
              { message: "Faulty access token" },
              { status: 401 }
            );
          }
      try {
        const data = await request.json()
        console.log(JSON.stringify(data));
        const res = await fetch(`${process.env.CHANNEL_ADD}`,
          {
          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data)
        })
        return NextResponse.json(res)
      }
      catch (error) {
        console.log("Error adding channel: " + error);
        return NextResponse.json(
          { message: error },
          { status: 500 }
        );
      }
    }

    export async function DELETE(request: NextRequest){
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
        const res = await fetch(`${process.env.CHANNEL_DEL}?channelid=${id}`,
          {
          method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            }
        })
        return NextResponse.json(res)
      }
      catch (error) {
        console.log("Error deleting Channel: " + error);
        return NextResponse.json(
          { message: error },
          { status: 500 }
        );
      }
    }

    export async function PUT(request: NextRequest){
      const accessToken = await getAccessToken(true);
        if (!accessToken) {
            console.log("Faulty access token");
            return NextResponse.json(
              { message: "Faulty access token" },
              { status: 401 }
            );
          }
      try {
        const data = await request.json()
        console.log(JSON.stringify(data));
        const res = await fetch(`${process.env.CHANNEL_EDIT}`,
          {
          method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data)
        })
        return NextResponse.json(res)
      }
      catch (error) {
        console.log("Error Editting Channel: " + error);
        return NextResponse.json(
          { message: error },
          { status: 500 }
        );
      }
    }