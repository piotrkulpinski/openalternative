export const loader = async () => {
  const url = process.env.SITE_URL ?? ""

  const robotText = `
    User-agent: *
    Allow: /

    Sitemap: ${url}/sitemap.xml
  `

  return new Response(robotText, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
