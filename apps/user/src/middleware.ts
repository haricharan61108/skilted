import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_USER_SECRET=process.env.NEXT_PUBLIC_JWT_USER_SECRET;
export async function middleware(request: NextRequest) {
  console.log("Middleware running user side for: ",request.nextUrl.pathname)
  const token=request.cookies.get("jwt")?.value;
  if(!token) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL('/login', request.url)) 
  } 
  try {
    const secret = new TextEncoder().encode(JWT_USER_SECRET)
    const { payload } = await jwtVerify(token, secret)
    console.log('Token verified:', payload)

    return NextResponse.next()
  } catch (error) {
    console.log('JWT verification failed:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
}

export const config = {
  matcher: ['/dashboard/:path*', '/user/:path*']
}