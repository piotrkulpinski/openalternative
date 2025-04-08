const excludePaths = ["/admin*", "/auth*", "/dashboard*"]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:5173",
  exclude: excludePaths,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: excludePaths,
      },
    ],
  },
}
