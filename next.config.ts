import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"
import { withPlausibleProxy } from "next-plausible"

const nextConfig: NextConfig = {
  reactStrictMode: false,
  skipTrailingSlashRedirect: true,

  experimental: {
    ppr: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      // {
      //   hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
      // },
      // { hostname: "**.amazonaws.com" },
      { hostname: "s3.us-east-1.amazonaws.com" },
      { hostname: "openalternative.s3.amazonaws.com" },
    ],
  },

  async rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

    return [
      // for posthog proxy
      {
        source: "/_proxy/posthog/ingest/static/:path*",
        destination: `${posthogHost?.replace("us", "us-assets")}/static/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/:path*",
        destination: `${posthogHost}/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/decide",
        destination: `${posthogHost}/decide`,
      },

      // TODO: RSS rewrites
      {
        source: "/rss.xml",
        destination: "/rss/tools.xml",
      },
      {
        source: "/alternatives/rss.xml",
        destination: "/rss/alternatives.xml",
      },
    ]
  },

  async redirects() {
    return [
      {
        source: "/latest",
        destination: "/",
        permanent: true,
      },
      {
        source: "/newsletter",
        destination: "/",
        permanent: true,
      },
      {
        source: "/sponsor",
        destination: "/advertise",
        permanent: true,
      },
    ]
  },
}

const plausibleProxy = withPlausibleProxy({
  customDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
  subdirectory: "_proxy/plausible",
})

export default withContentCollections(plausibleProxy(nextConfig))
