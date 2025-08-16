import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { JWT_SECRET } from 'config';
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  console.log("Middleware running for:",request.nextUrl.pathname)
  const token=request.cookies.get("jwt")?.value;
  if(!token) {
    console.log("Redirecting to login");
    return NextResponse.redirect(new URL('/login', request.url)) 
  } 
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)

    const { payload } = await jwtVerify(token, secret)
    console.log('Token verified:', payload)

    return NextResponse.next()
  } catch (error) {
    console.log('JWT verification failed:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}