import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

const authList = ["/sign-in", "/sign-up", "/forgot-password"];
const whiteList = ["/"];

export function middleware(request: NextRequest) {
  console.log(`Received ${request.method} request to ${request.url} at ${new Date()}`);
  const cookieStore =   cookies();
  let isAuthUrl = false;
  let isWhiteListUrl = false;
  const currentUser = cookieStore.get("user_session")?.value;
  authList.forEach((url) => {
    if (request.nextUrl.pathname === url) {
      isAuthUrl = true;
    }
  });

  whiteList.forEach((url) => {
    if (request.nextUrl.pathname === url) {
      isWhiteListUrl = true;
    }
  });

  //logic to request a new access token if it's about to expire (ttl < 60s)
  //or if it has expired
  //...

  //go to sign-in page if user hasn't logged in and the request url is restricted
  if (!currentUser && !isAuthUrl && !isWhiteListUrl) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  //go back to direct-message if user has logged in and the request is to an auth url
  if (currentUser && isAuthUrl) {
    return NextResponse.redirect(new URL("/direct-message", request.url));
  }

  return NextResponse.next();
}

export const config = {
  //urls that go through middleware
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|assets|favicon.ico).*)",
  ],
};
