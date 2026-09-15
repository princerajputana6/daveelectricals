/**
 * The path the Dave Cleaning app is served under.
 *
 * The app is deployed as an "unlisted" demo — reachable only if you know the
 * URL. Next.js applies this basePath automatically to <Link>, next/image,
 * next/navigation redirect()/router, and API route mounting. It does NOT touch
 * raw client `fetch()` calls, raw <img>/<source> src, or server-side absolute
 * URLs built from the request origin (Stripe success/cancel URLs, manual
 * `new URL(path, req.url)` redirects) — those must be wrapped with `withBase`.
 *
 * KEEP IN SYNC with `basePath` in next.config.mjs.
 */
export const BASE_PATH = "/demo/dave-cleaning-services";

/** Prefix an app-absolute path (fetch URL, raw asset src) with the base path. */
export const withBase = (path: string): string => `${BASE_PATH}${path}`;
