import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { getAccessToken } from "./services/AuthService";
import {
  accessTokenCookieName,
  oauth2AuthResultCookieName,
  userSessionCookieName,
} from "./utils/constants";
import { AuthResult } from "./components/Auth/SignIn";

const authList = ["/sign-in", "/sign-up", "/forgot-password", "/activate"];
const oauth2AccountRegistrationList = ["/oauth2/account-registration"];
const whiteList = ["/"];

export function middleware(request: NextRequest) {
  console.log(
    `Received ${request.method} request to ${request.url} at ${new Date()}`
  );
  const cookieStore = cookies();
  let isAuthUrl = false;
  let isWhiteListUrl = false;
  let isOauth2List = false;
  const currentUser = cookieStore.get(userSessionCookieName)?.value;
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

  oauth2AccountRegistrationList.forEach((url) => {
    if (request.nextUrl.pathname === url) {
      isOauth2List = true;
    }
  });

  //go back to sign-in if user hasn't finished the authorization grant part in oauth2 flow
  if (isOauth2List) {
    const access_token = cookieStore.get(accessTokenCookieName)?.value;
    const oauth2AuthResult = cookieStore.get(oauth2AuthResultCookieName)?.value;
    if (
      !access_token &&
      oauth2AuthResult !==
        AuthResult.INCOMPLETE_REQUIRE_ACCOUNT_REGISTRATION.toString()
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  //go to sign-in page if user hasn't logged in and the request url is restricted
  if (!currentUser && !isAuthUrl && !isWhiteListUrl && !isOauth2List) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  //go back to direct-message if user has logged in and the request is to an auth url
  if (currentUser && isAuthUrl) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
