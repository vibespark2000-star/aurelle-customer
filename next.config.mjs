/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /*
     * Output file tracing produces the .nft.json manifests that `output: "standalone"`
     * builds need to copy node_modules. This project is deployed with `next start`
     * against the full repo, so those manifests are never read — and on Windows the
     * trace step intermittently emits nothing and then throws ENOENT reading its own
     * output, aborting the build and leaving a half-written .next directory.
     * Turn it off: nothing here consumes it. Re-enable if you move to standalone
     * output or a serverless target.
     */
    outputFileTracing: false,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/**" }],
  },
  async redirects() {
    return [
      // Legacy short URLs for the legal pages.
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
    ];
  },
};

export default nextConfig;
