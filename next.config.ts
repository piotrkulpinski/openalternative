import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"
import { withPlausibleProxy } from "next-plausible"

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,

  images: {
    remotePatterns: [
      { hostname: `${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com` },
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
    ]
  },
}

const plausibleProxy = withPlausibleProxy({
  customDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_HOST,
  subdirectory: "_proxy/plausible",
})

export default plausibleProxy(withContentCollections(nextConfig))
