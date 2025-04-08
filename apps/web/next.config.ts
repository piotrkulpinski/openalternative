import { withContentCollections } from "@content-collections/next"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: false,

  experimental: {
    ppr: true,
    useCache: true,

    optimizePackageImports: [
      "@content-collections/core",
      "@content-collections/mdx",
      "@content-collections/next",
    ],
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 768, 1024],
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
        source: "/languages/:path*",
        destination: "/stacks/:path*",
        permanent: true,
      },
      {
        source: "/licenses/:path*/tools",
        destination: "/licenses/:path*",
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
      {
        source: "/categories/feedback-management",
        destination:
          "/categories/business-software/customer-support-success/feedback-feature-request-management",
        permanent: true,
      },
      {
        source: "/categories/communication",
        destination: "/categories/business-software/collaboration-communication",
        permanent: true,
      },
      {
        source: "/categories/cms",
        destination: "/categories/content-publishing/content-management-systems-cms",
        permanent: true,
      },
      {
        source: "/categories/auth-and-sso",
        destination:
          "/categories/security-privacy/identity-access-management-iam/authentication-sso-providers",
        permanent: true,
      },
      {
        source: "/categories/customer-engagement",
        destination: "/categories/business-software/marketing-customer-engagement",
        permanent: true,
      },
      {
        source: "/categories/design",
        destination: "/categories/specialized-industries/design-prototyping",
        permanent: true,
      },
      {
        source: "/categories/internal-tools",
        destination: "/categories/developer-tools/frameworks-platforms/low-code-no-code-platforms",
        permanent: true,
      },
      {
        source: "/categories/feature-flag-management",
        destination: "/categories/security-privacy/application-security/feature-flags",
        permanent: true,
      },
      {
        source: "/categories/digital-signature",
        destination:
          "/categories/business-software/document-management-e-signatures/e-signature-platforms",
        permanent: true,
      },
      {
        source: "/categories/log-management",
        destination:
          "/categories/infrastructure-operations/monitoring-observability/log-management",
        permanent: true,
      },
      {
        source: "/categories/communities",
        destination: "/categories/community-social/community-building-platforms",
        permanent: true,
      },
      {
        source: "/categories/crm",
        destination: "/categories/business-software/crm-sales/crm-systems",
        permanent: true,
      },
      {
        source: "/categories/marketing",
        destination: "/categories/business-software/marketing-customer-engagement",
        permanent: true,
      },
      {
        source: "/categories/financial-service",
        destination: "/categories/specialized-industries/finance-fintech",
        permanent: true,
      },
      {
        source: "/categories/business-intelligence",
        destination: "/categories/data-analytics/business-intelligence-reporting",
        permanent: true,
      },
      {
        source: "/categories/email",
        destination: "/categories/productivity-utilities/email-communication",
        permanent: true,
      },
      {
        source: "/categories/product-analytics",
        destination: "/categories/data-analytics/analytics/product-analytics",
        permanent: true,
      },
      {
        source: "/categories/no-code",
        destination: "/categories/developer-tools/frameworks-platforms/low-code-no-code-platforms",
        permanent: true,
      },
      {
        source: "/categories/notetaking",
        destination:
          "/categories/productivity-utilities/note-taking-knowledge-management/note-taking",
        permanent: true,
      },
      {
        source: "/categories/low-code",
        destination: "/categories/developer-tools/frameworks-platforms/low-code-no-code-platforms",
        permanent: true,
      },
      {
        source: "/categories/messaging",
        destination:
          "/categories/business-software/collaboration-communication/team-chat-messaging",
        permanent: true,
      },
      {
        source: "/categories/knowledge-management",
        destination:
          "/categories/productivity-utilities/note-taking-knowledge-management/personal-knowledge-management-pkm",
        permanent: true,
      },
      {
        source: "/categories/productivity",
        destination: "/categories/productivity-utilities",
        permanent: true,
      },
      {
        source: "/categories/form-building",
        destination: "/categories/business-software/forms-surveys/form-builders",
        permanent: true,
      },
      {
        source: "/categories/search-engine",
        destination: "/categories/infrastructure-operations/search-servers",
        permanent: true,
      },
      {
        source: "/categories/backend-as-a-service",
        destination: "/categories/developer-tools/frameworks-platforms/backend-as-a-service-baas",
        permanent: true,
      },
      {
        source: "/categories/api-platform",
        destination: "/categories/developer-tools/api-development-testing/api-infrastructure",
        permanent: true,
      },
      {
        source: "/categories/monitoring",
        destination: "/categories/infrastructure-operations/monitoring-observability",
        permanent: true,
      },
      {
        source: "/categories/software-development",
        destination: "/categories/developer-tools",
        permanent: true,
      },
      {
        source: "/categories/time-tracking",
        destination: "/categories/productivity-utilities/time-task-management/time-tracking",
        permanent: true,
      },
      {
        source: "/categories/website-analytics",
        destination: "/categories/data-analytics/analytics/web-analytics",
        permanent: true,
      },
      {
        source: "/categories/website-builder",
        destination: "/categories/developer-tools/website-builders",
        permanent: true,
      },
      {
        source: "/categories/scheduling",
        destination:
          "/categories/business-software/scheduling-event-management/appointment-scheduling",
        permanent: true,
      },
      {
        source: "/categories/workflow-automation",
        destination:
          "/categories/productivity-utilities/automation-tools/workflow-automation-platforms",
        permanent: true,
      },
      {
        source: "/categories/screen-recording",
        destination:
          "/categories/productivity-utilities/screen-capture-recording/screen-recording-tools",
        permanent: true,
      },
      {
        source: "/categories/commerce",
        destination: "/categories/business-software/e-commerce-platforms",
        permanent: true,
      },
      {
        source: "/categories/project-management",
        destination:
          "/categories/business-software/project-work-management/project-management-suites",
        permanent: true,
      },
      {
        source: "/categories/database",
        destination: "/categories/infrastructure-operations/databases",
        permanent: true,
      },
      {
        source: "/categories/observability",
        destination: "/categories/infrastructure-operations/monitoring-observability",
        permanent: true,
      },
      {
        source: "/categories/ai",
        destination: "/categories/ai-machine-learning",
        permanent: true,
      },
      {
        source: "/categories/learning-management",
        destination: "/categories/content-publishing/learning-management-systems-lms",
        permanent: true,
      },
      {
        source: "/categories/security",
        destination: "/categories/security-privacy",
        permanent: true,
      },
      {
        source: "/categories/file-hosting",
        destination:
          "/categories/productivity-utilities/file-management-sync/cloud-file-sync-share",
        permanent: true,
      },
      {
        source: "/categories/social-media",
        destination:
          "/categories/business-software/marketing-customer-engagement/social-media-management",
        permanent: true,
      },
      {
        source: "/categories/document-management",
        destination:
          "/categories/business-software/document-management-e-signatures/document-management-systems",
        permanent: true,
      },
      {
        source: "/categories/data-integration",
        destination: "/categories/data-analytics/data-engineering-integration",
        permanent: true,
      },
      {
        source: "/categories/remote-access",
        destination: "/categories/productivity-utilities/remote-desktop-access",
        permanent: true,
      },
      {
        source: "/categories/url-shorteners",
        destination:
          "/categories/business-software/marketing-customer-engagement/link-management-shorteners",
        permanent: true,
      },
      {
        source: "/categories/data-management",
        destination: "/categories/data-analytics/data-engineering-integration",
        permanent: true,
      },
      {
        source: "/categories/notification",
        destination: "/categories/productivity-utilities/push-notification",
        permanent: true,
      },
      {
        source: "/categories/sales",
        destination: "/categories/business-software/crm-sales",
        permanent: true,
      },
      {
        source: "/categories/web-crawling",
        destination: "/categories/data-analytics/data-extraction-web-scraping/web-crawlers",
        permanent: true,
      },
      {
        source: "/categories/erp",
        destination: "/categories/business-software/erp-operations/erp-systems",
        permanent: true,
      },
      {
        source: "/categories/personal-finance",
        destination: "/categories/productivity-utilities/personal-finance-management",
        permanent: true,
      },
      {
        source: "/categories/documentation",
        destination: "/categories/content-publishing/documentation-knowledge-base",
        permanent: true,
      },
      {
        source: "/categories/infrastructure-as-code",
        destination:
          "/categories/infrastructure-operations/cloud-infrastructure-management/infrastructure-as-code-iac",
        permanent: true,
      },
      {
        source: "/categories/paas",
        destination: "/categories/developer-tools/build-deployment/paas-deployment-tools",
        permanent: true,
      },
      {
        source: "/categories/cloud-storage",
        destination: "/categories/infrastructure-operations/storage-solutions/cloud-storage",
        permanent: true,
      },
      {
        source: "/categories/control-panel",
        destination: "/categories/infrastructure-operations/server-vm-management/control-panels",
        permanent: true,
      },
      {
        source: "/categories/desktop-apps",
        destination: "/categories/productivity-utilities",
        permanent: true,
      },
      {
        source: "/categories/mobile-apps",
        destination: "/categories/productivity-utilities",
        permanent: true,
      },
      {
        source: "/categories/human-resource-management",
        destination: "/categories/business-software/human-resources-hr/hr-management-systems-hrms",
        permanent: true,
      },
      {
        source: "/categories/secretops-platform",
        destination: "/categories/security-privacy/secrets-management/secrets-platforms",
        permanent: true,
      },
      {
        source: "/categories/ide",
        destination: "/categories/developer-tools/ides-code-editors",
        permanent: true,
      },
      {
        source: "/categories/internationalization",
        destination: "/categories/content-publishing/publishing-tools/translation-management",
        permanent: true,
      },
      {
        source: "/categories/customer-feedback",
        destination:
          "/categories/business-software/customer-support-success/feedback-feature-request-management",
        permanent: true,
      },
      {
        source: "/categories/ai-infrastructure",
        destination: "/categories/ai-machine-learning/machine-learning-infrastructure",
        permanent: true,
      },
    ]
  },
}

// @ts-expect-error
export default withContentCollections(nextConfig)
