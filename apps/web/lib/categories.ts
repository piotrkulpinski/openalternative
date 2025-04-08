import type { Category } from "@openalternative/db/client"
import { getCategoryAncestors } from "~/server/web/categories/queries"

export const categoryRedirects = [
  {
    source: "feedback-management",
    destination: "business-software/customer-support-success/feedback-feature-request-management",
  },
  {
    source: "communication",
    destination: "business-software/collaboration-communication",
  },
  {
    source: "cms",
    destination: "content-publishing/content-management-systems-cms",
  },
  {
    source: "auth-and-sso",
    destination: "security-privacy/identity-access-management-iam/authentication-sso-providers",
  },
  {
    source: "customer-engagement",
    destination: "business-software/marketing-customer-engagement",
  },
  {
    source: "design",
    destination: "specialized-industries/design-prototyping",
  },
  {
    source: "internal-tools",
    destination: "developer-tools/frameworks-platforms/low-code-no-code-platforms",
  },
  {
    source: "feature-flag-management",
    destination: "security-privacy/application-security/feature-flags",
  },
  {
    source: "digital-signature",
    destination: "business-software/document-management-e-signatures/e-signature-platforms",
  },
  {
    source: "log-management",
    destination: "infrastructure-operations/monitoring-observability/log-management",
  },
  {
    source: "communities",
    destination: "community-social/community-building-platforms",
  },
  {
    source: "crm",
    destination: "business-software/crm-sales/crm-systems",
  },
  {
    source: "marketing",
    destination: "business-software/marketing-customer-engagement",
  },
  {
    source: "financial-service",
    destination: "specialized-industries/finance-fintech",
  },
  {
    source: "business-intelligence",
    destination: "data-analytics/business-intelligence-reporting",
  },
  {
    source: "email",
    destination: "productivity-utilities/email-communication",
  },
  {
    source: "product-analytics",
    destination: "data-analytics/analytics/product-analytics",
  },
  {
    source: "no-code",
    destination: "developer-tools/frameworks-platforms/low-code-no-code-platforms",
  },
  {
    source: "notetaking",
    destination: "productivity-utilities/note-taking-knowledge-management/note-taking",
  },
  {
    source: "low-code",
    destination: "developer-tools/frameworks-platforms/low-code-no-code-platforms",
  },
  {
    source: "messaging",
    destination: "business-software/collaboration-communication/team-chat-messaging",
  },
  {
    source: "knowledge-management",
    destination:
      "productivity-utilities/note-taking-knowledge-management/personal-knowledge-management-pkm",
  },
  {
    source: "productivity",
    destination: "productivity-utilities",
  },
  {
    source: "form-building",
    destination: "business-software/forms-surveys/form-builders",
  },
  {
    source: "search-engine",
    destination: "infrastructure-operations/search-servers",
  },
  {
    source: "backend-as-a-service",
    destination: "developer-tools/frameworks-platforms/backend-as-a-service-baas",
  },
  {
    source: "api-platform",
    destination: "developer-tools/api-development-testing/api-infrastructure",
  },
  {
    source: "monitoring",
    destination: "infrastructure-operations/monitoring-observability",
  },
  {
    source: "software-development",
    destination: "developer-tools",
  },
  {
    source: "time-tracking",
    destination: "productivity-utilities/time-task-management/time-tracking",
  },
  {
    source: "website-analytics",
    destination: "data-analytics/analytics/web-analytics",
  },
  {
    source: "website-builder",
    destination: "developer-tools/website-builders",
  },
  {
    source: "scheduling",
    destination: "business-software/scheduling-event-management/appointment-scheduling",
  },
  {
    source: "workflow-automation",
    destination: "productivity-utilities/automation-tools/workflow-automation-platforms",
  },
  {
    source: "screen-recording",
    destination: "productivity-utilities/screen-capture-recording/screen-recording-tools",
  },
  {
    source: "commerce",
    destination: "business-software/e-commerce-platforms",
  },
  {
    source: "project-management",
    destination: "business-software/project-work-management/project-management-suites",
  },
  {
    source: "database",
    destination: "infrastructure-operations/databases",
  },
  {
    source: "observability",
    destination: "infrastructure-operations/monitoring-observability",
  },
  {
    source: "ai",
    destination: "ai-machine-learning",
  },
  {
    source: "learning-management",
    destination: "content-publishing/learning-management-systems-lms",
  },
  {
    source: "security",
    destination: "security-privacy",
  },
  {
    source: "file-hosting",
    destination: "productivity-utilities/file-management-sync/cloud-file-sync-share",
  },
  {
    source: "social-media",
    destination: "business-software/marketing-customer-engagement/social-media-management",
  },
  {
    source: "document-management",
    destination: "business-software/document-management-e-signatures/document-management-systems",
  },
  {
    source: "data-integration",
    destination: "data-analytics/data-engineering-integration",
  },
  {
    source: "remote-access",
    destination: "productivity-utilities/remote-desktop-access",
  },
  {
    source: "url-shorteners",
    destination: "business-software/marketing-customer-engagement/link-management-shorteners",
  },
  {
    source: "data-management",
    destination: "data-analytics/data-engineering-integration",
  },
  {
    source: "notification",
    destination: "productivity-utilities/push-notification",
  },
  {
    source: "sales",
    destination: "business-software/crm-sales",
  },
  {
    source: "web-crawling",
    destination: "data-analytics/data-extraction-web-scraping/web-crawlers",
  },
  {
    source: "erp",
    destination: "business-software/erp-operations/erp-systems",
  },
  {
    source: "personal-finance",
    destination: "productivity-utilities/personal-finance-management",
  },
  {
    source: "documentation",
    destination: "content-publishing/documentation-knowledge-base",
  },
  {
    source: "infrastructure-as-code",
    destination:
      "infrastructure-operations/cloud-infrastructure-management/infrastructure-as-code-iac",
  },
  {
    source: "paas",
    destination: "developer-tools/build-deployment/paas-deployment-tools",
  },
  {
    source: "cloud-storage",
    destination: "infrastructure-operations/storage-solutions/cloud-storage",
  },
  {
    source: "control-panel",
    destination: "infrastructure-operations/server-vm-management/control-panels",
  },
  {
    source: "desktop-apps",
    destination: "productivity-utilities",
  },
  {
    source: "mobile-apps",
    destination: "productivity-utilities",
  },
  {
    source: "human-resource-management",
    destination: "business-software/human-resources-hr/hr-management-systems-hrms",
  },
  {
    source: "secretops-platform",
    destination: "security-privacy/secrets-management/secrets-platforms",
  },
  {
    source: "ide",
    destination: "developer-tools/ides-code-editors",
  },
  {
    source: "internationalization",
    destination: "content-publishing/publishing-tools/translation-management",
  },
  {
    source: "customer-feedback",
    destination: "business-software/customer-support-success/feedback-feature-request-management",
  },
  {
    source: "ai-infrastructure",
    destination: "ai-machine-learning/machine-learning-infrastructure",
  },
]

export const getCategoryPath = async (category: Pick<Category, "slug" | "parentId">) => {
  if (!category.parentId) {
    return category.slug
  }

  const categoryAncestors = await getCategoryAncestors(category.slug)

  return categoryAncestors.join("/")
}
