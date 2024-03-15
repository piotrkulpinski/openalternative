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
}

export default nextConfig
