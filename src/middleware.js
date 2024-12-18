import { NextResponse } from "next/server";
import { verifyToken } from "./utils/verifyToken.mjs";
import logOut from "./utils/logOut.mjs";
import { TOKEN_COOKIE } from "./constants/constantNames.mjs";


export async function middleware(request) {
  // return NextResponse.next();
  let token = request.cookies
    .get(TOKEN_COOKIE)
    ?.value?.split("Bearer")[1]
    ?.trim();
  const pathName = request.nextUrl.pathname;

  if (pathName === "/login" && token) {

    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token && pathName !== "/login") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathName);
    return NextResponse.redirect(loginUrl);
  }
  
  // if (pathName.includes("/api") && token) {
  //   const payload = await verifyToken(token);
  //   if (!payload) {
  //     await logOut();
  //     const loginUrl = new URL("/login", request.url);
  //     loginUrl.searchParams.set("redirectTo", pathName);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
  ],
};
