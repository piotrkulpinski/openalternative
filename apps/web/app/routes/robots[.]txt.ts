export const loader = async () => {
  const url = import.meta.env.NEXT_PUBLIC_SITE_URL ?? ""

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
