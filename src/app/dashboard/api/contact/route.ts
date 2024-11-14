import { getAccessToken } from '@/services/AuthService';
import { ContactResponse } from '@/types/response';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET(request: NextRequest): Promise<NextResponse<{body?:ContactResponse, message: string}>>{
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const dataSize = 20;
  const accessToken = await getAccessToken(true);
  // const sortBy = "last_message_date";

  console.log("Page: ", page);
  if(Number(page) <= 0) {
    return NextResponse.json({ message: "Invalid page number" }, { status: 400 });
  }

  try{
    const result = await fetch(`${process.env.FETCH_CONTACTS}?size=${dataSize}&page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 300,
        tags: ["conversations"]
      },
    });

    if(!result.ok) {
      return NextResponse.json({ message: "Failed to fetch contacts" }, { status: 400 });
    }

    const data = await result.json();
    console.log("Contacts data: ", data);
    console.log("Detailed Contacts data: ", JSON.stringify(data));
    return NextResponse.json(data as ContactResponse, { status: 200 });
  } catch(error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }

  // res.end(`Post: ${pid}`)
}