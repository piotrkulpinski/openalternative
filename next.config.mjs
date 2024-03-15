/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@curiousleaf/design", "@curiousleaf/utils"],

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "api.screenshotone.com",
      },
    ],
  },

  headers: async () => {
    if (process.env.NODE_ENV !== "production") {
      return []
    }

    // Turn on caching for static assets
    return [
      {
        source: "/:all*(css|js|gif|svg|jpg|jpeg|png|woff|woff2)",
        locale: false,
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000" }],
      },
    ]
  },
}

export default nextConfig
