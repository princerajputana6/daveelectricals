/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Serve the whole app under an unlisted demo path. KEEP IN SYNC with
  // BASE_PATH in lib/basePath.ts. Nothing links to this URL — it is reachable
  // only if you already have it.
  basePath: "/demo/dave-cleaning-services",
};

export default nextConfig;
