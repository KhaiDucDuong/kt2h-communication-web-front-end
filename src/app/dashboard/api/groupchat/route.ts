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
            } ,
            // next: {
            //    revalidate: 30,
            //    tags: ["groupChats"]
            //  },
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
    const res = await fetch(`${process.env.GROUP_ADD}`,
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
    console.log("Error adding Groupchat: " + error);
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
      const res = await fetch(`${process.env.GROUP_EDIT}`,
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
      console.log("Error Editting Groupchat: " + error);
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
        const res = await fetch(`${process.env.GROUP_DEL}?groupid=${id}`,
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
        console.log("Error deleting Groupchat: " + error);
        return NextResponse.json(
          { message: error },
          { status: 500 }
        );
      }
    }
