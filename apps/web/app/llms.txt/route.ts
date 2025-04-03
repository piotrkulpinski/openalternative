import { db } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { NextResponse } from "next/server"
import { allPosts } from "~/.content-collections/generated"
import { siteConfig } from "~/config/site"
import { getToolSuffix } from "~/lib/tools"
import { toolAlternativesPayload } from "~/server/web/tools/payloads"

export async function GET() {
  const tools = await db.tool.findMany({
    where: { status: ToolStatus.Published },
    orderBy: { pageviews: "desc" },
    select: { name: true, slug: true, tagline: true, alternatives: toolAlternativesPayload },
  })

  let content = `# ${siteConfig.name} - ${siteConfig.tagline}
${siteConfig.description}\n
## Blog Highlights
Links to our most popular blog posts.\n
${allPosts.map(post => `- [${post.title}](${siteConfig.url}/blog/${post._meta.path})`).join("\n")}\n
## Open source tools\n`

  for (const tool of tools) {
    content += `- [${tool.name}](${siteConfig.url}/${tool.slug}): ${getToolSuffix(tool)}\n`
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store",
    },
  })
}
