import { siteConfig } from "~/config/site"

export const linksConfig = {
  feed: `${siteConfig.url}/rss.xml`,
  author: "https://kulpinski.pl",
  twitter: "https://x.com/ossalternative",
  bluesky: "https://bsky.app/profile/openalternative.co",
  linkedin: "https://linkedin.com/company/openalternative",
  github: "https://github.com/piotrkulpinski/openalternative",
  analytics: "https://go.openalternative.co/analytics",
  family: [
    {
      title: "DevSuite",
      href: "https://devsuite.co",
      description: "Find the perfect developer tools for your next project",
    },
    {
      title: "Superstash",
      href: "https://superstash.co",
      description: "No-code directory website builder",
    },
    {
      title: "Chipmunk Theme",
      href: "https://chipmunktheme.com",
      description: "Build directory websites in WordPress",
    },
  ],
}
