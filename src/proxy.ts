import { auth } from "@/auth";

export default auth((req) => {
  // You can add route protection logic here later
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/checkout/:path*",
  ],
};
