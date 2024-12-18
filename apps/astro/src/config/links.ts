import { siteConfig } from "~/config/site"
import HackerNewsLogo from "~/assets/press/hackernews.svg"
import IndieHackersLogo from "~/assets/press/indiehackers.svg"
import ProductHuntLogo from "~/assets/press/producthunt.svg"
import TwitterLogo from "~/assets/press/twitter.svg"

export const linksConfig = {
  author: "https://kulpinski.pl",
  twitter: "https://x.com/ossalternative",
  bluesky: "https://bsky.app/profile/openalternative.co",
  linkedin: "https://linkedin.com/company/openalternative",
  github: "https://github.com/piotrkulpinski/openalternative",
  analytics: "https://go.openalternative.co/analytics",
  feeds: [
    { title: "Open Source Tools", url: `${siteConfig.url}/rss/tools.xml` },
    { title: "Proprietary Alternatives", url: `${siteConfig.url}/rss/alternatives.xml` },
  ],
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
  toolsUsed: [
    {
      title: "ScreenshotOne",
      href: "https://kulp.in/screenshotone",
      description: "The screenshot API for developers",
    },
    {
      title: "Typefully",
      href: "https://kulp.in/typefully",
      description: "Twitter scheduling/analytics",
    },
    {
      title: "Beehiiv",
      href: "https://kulp.in/beehiiv",
      description: "Newsletter",
    },
    {
      title: "Airtable",
      href: "https://kulp.in/airtable",
      description: "Database",
    },
    {
      title: "Screen Studio",
      href: "https://kulp.in/screenstudio",
      description: "Screen recording for marketing videos",
    },
  ],
}
