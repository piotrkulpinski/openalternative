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
      { hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com` },
    ],
  },

  async rewrites() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    const posthogUrl = process.env.NEXT_PUBLIC_POSTHOG_HOST

    return [
      // RSS rewrites
      {
        source: "/rss.xml",
        destination: `${siteUrl}/rss/tools.xml`,
      },
      {
        source: "/alternatives/rss.xml",
        destination: `${siteUrl}/rss/alternatives.xml`,
      },

      // for posthog proxy
      {
        source: "/_proxy/posthog/ingest/static/:path*",
        destination: `${posthogUrl?.replace("us", "us-assets")}/static/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/:path*",
        destination: `${posthogUrl}/:path*`,
      },
      {
        source: "/_proxy/posthog/ingest/decide",
        destination: `${posthogUrl}/decide`,
      },
    ]
  },

  async redirects() {
    return [
      {
        source: "/latest",
        destination: "/?sort=publishedAt.desc",
        permanent: true,
      },
      {
        source: "/topics",
        destination: "/topics/letter/a",
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
