import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ['/', '/api/webhook/clerk'], //as by default clerk auth middleware will treat all routes as private
  ignoredRoutes: ['/api/webhook/clerk'], //as clerk webhook are public
  //This is done because clerk webhook are now public and we don't want to redirect clerk webhook to login page
});
 
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};