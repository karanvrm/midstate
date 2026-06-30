import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

const getRoleDashboardPath = (role?: string) => {
  if (role === "OWNER") {
    return "/dashboard/owner";
  }

  if (role === "ADMIN") {
    return "/dashboard/owner/job-descriptions";
  }

  return "/dashboard/staff";
};

export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token;
    const { pathname } = request.nextUrl;
    const isAuthenticated = Boolean(token?.id && token.status === "ACTIVE");

    if ((pathname === "/" || pathname.startsWith("/auth")) && isAuthenticated && token) {
      return NextResponse.redirect(new URL(getRoleDashboardPath(token.role), request.url));
    }

    if (
      pathname.startsWith("/dashboard/owner/job-descriptions") ||
      pathname.startsWith("/dashboard/owner/briefings")
    ) {
      if (token?.role !== "OWNER" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else if (pathname.startsWith("/dashboard/owner") && token?.role !== "OWNER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (pathname.startsWith("/dashboard/staff")) {
      const isOwner = token?.role === "OWNER";
      const isAdmin = token?.role === "ADMIN";
      
      if (token?.role !== "STAFF" && !isOwner && !isAdmin) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/staff", request.url));
    }

    return NextResponse.next();
  },
  {
    secret: authSecret,
    pages: {
      signIn: "/auth/sign-in",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/" || pathname.startsWith("/auth")) {
          return true;
        }

        return Boolean(token?.id && token.status === "ACTIVE");
      },
    },
  },
);

export const config = {
  matcher: ["/", "/auth/:path*", "/dashboard/:path*", "/admin/:path*", "/staff/:path*", "/briefing/:path*"],
};
