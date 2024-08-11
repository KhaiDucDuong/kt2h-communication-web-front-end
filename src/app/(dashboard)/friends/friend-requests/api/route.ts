import { getAccessToken } from "@/services/AuthService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    let page = searchParams.get('page')
    const type = searchParams.get('type')
    const accessToken = await getAccessToken();
  
    if(!accessToken){
      console.log("Faulty access token");
      return;
    }

    if(!page){
        page = "1"
    }
  
    if(type === "INCOMING"){
        return fetchIncomingRequest(page, accessToken)
    } else if(type === "OUTGOING"){
        return fetchOutgoingRequest(page, accessToken)
    } else {
        console.log(`Invalid request type ${type}`)
        return;
    }
  }

async function fetchIncomingRequest(page: string, accessToken: string){
    const dataSize = 20;
    console.log(`Fetching incoming friend requests at page ${page}`);
    try{
      const res = await fetch(
        `${process.env.FETCH_INCOMING_FRIEND_REQUEST}?size=${dataSize}&page=${page}&sort=createdDate,asc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          next: {
            revalidate: 60
          }
        }
      );
      const body = await res.json();
      console.log("Incoming friend requests response: " + JSON.stringify(body));
      return NextResponse.json({ body });
    } catch(error){
      console.log("Error fetching user incoming friend requests: " + error);
      return;
    }
}

async function fetchOutgoingRequest(page: string, accessToken: string){
    const dataSize = 20;
    console.log(`Fetching outgoing friend requests at page ${page}`);
    try{
      const res = await fetch(
        `${process.env.FETCH_OUTGOING_FRIEND_REQUEST}?size=${dataSize}&page=${page}&sort=createdDate,asc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          next: {
            revalidate: 60
          }
        }
      );
      const body = await res.json();
      console.log("Outgoing friend requests response: " + JSON.stringify(body));
      return NextResponse.json({ body });
    } catch(error){
      console.log("Error fetching user outgoing friend requests: " + error);
      return;
    }
}