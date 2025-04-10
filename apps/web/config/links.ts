import { siteConfig } from "~/config/site"

export const linksConfig = {
  madeWith: "https://dirstarter.com",
  author: "https://kulpinski.pl",
  twitter: "https://x.com/ossalternative",
  bluesky: "https://bsky.app/profile/openalternative.co",
  mastodon: "https://mastodon.social/@openalternative",
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
      title: "OpenAds",
      href: "https://openads.co",
      description: "Automate ad spot management and increase website revenue",
    },
    {
      title: "Dirstarter",
      href: "https://dirstarter.com",
      description: "Next.js directory website boilerplate",
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
  featured: [
    {
      name: "Hacker News",
      url: "https://news.ycombinator.com/item?id=39639386",
      icon: "/hackernews.svg",
    },
    {
      name: "Indie Hackers",
      url: "https://www.indiehackers.com/post/how-i-grew-a-side-project-to-100k-unique-visitors-in-7-days-with-0-audience-15d48ea192",
      icon: "/indiehackers.svg",
    },
    {
      name: "Product Hunt",
      url: "https://www.producthunt.com/posts/openalternative",
      icon: "/producthunt.svg",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/steventey/status/1765841867017437599",
      icon: "/twitter.svg",
    },
  ],
}
