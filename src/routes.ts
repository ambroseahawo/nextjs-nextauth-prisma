/**
 * An array of routes that are accessible to public
 * These routes don't need authentication
 * @type {string[]}
 */
export const publicRoutes: string[] = [
  "/",
  "/auth/new-verification",
  "/auth/verification-sent",
  "/auth/request-reset-password",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to protected routes
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/register", "/auth/login", "/auth/error"];

/**
 * Prefix for api authentication routes
 * Routes that start with this prefix are used for api authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The default redirect route after login
 *@type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/settings";
