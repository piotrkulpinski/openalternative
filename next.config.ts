import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: [
      // {
      //   hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`,
      // },
      { hostname: "**.amazonaws.com" },
      { hostname: "**.google.com" },
    ],
  },

  async rewrites() {
    const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
    const plausibleHost = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST

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

      // for plausible proxy
      {
        source: "/_proxy/plausible/script.js",
        destination: `${plausibleHost}/js/script.js`,
      },
      {
        source: "/_proxy/plausible/event",
        destination: `${plausibleHost}/api/event`,
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
}

export default withContentCollections(nextConfig)
