import { getCurrentPage } from "@curiousleaf/utils"
import { Prisma } from "@prisma/client"
import { LoaderFunctionArgs, json } from "@remix-run/node"
import { toolManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { toolsSearchParamsSchema } from "~/store/tools"
import { JSON_HEADERS, TOOLS_PER_PAGE } from "~/utils/constants"
import { isMobileAgent } from "~/utils/helpers"
import { getSearchQuery } from "~/utils/queryString"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)

  const searchParams = Object.fromEntries(url.searchParams)
  const { page, query, order } = toolsSearchParamsSchema.parse(searchParams)

  const isMobile = isMobileAgent(request.headers.get("user-agent"))
  const currentPage = getCurrentPage(page)
  const take = isMobile ? TOOLS_PER_PAGE / 3 : TOOLS_PER_PAGE
  const skip = (currentPage - 1) * take
  const search = getSearchQuery(query)

  let orderBy: Prisma.ToolFindManyArgs["orderBy"]

  if (search) {
    orderBy = {
      _relevance: {
        search,
        fields: ["name", "description"],
        sort: Prisma.SortOrder.desc,
      },
    }
  } else {
    switch (order) {
      case "name":
        orderBy = { name: "asc" }
        break
      case "stars":
        orderBy = { stars: "desc" }
        break
      case "forks":
        orderBy = { forks: "desc" }
        break
      case "commit":
        orderBy = { lastCommitDate: "desc" }
        break
      default:
        orderBy = { score: "desc" }
    }

    orderBy = [{ isFeatured: "desc" }, orderBy]
  }

  const where = {
    isDraft: false,
    ...(search && {
      OR: [
        { name: { search } },
        { description: { search } },
        { topics: { some: { topic: { slug: { equals: query } } } } },
        { languages: { some: { language: { slug: { equals: query } } } } },
        { alternatives: { some: { alternative: { name: { search } } } } },
      ],
    }),
  }

  const tools = await prisma.tool.findMany({
    where,
    take,
    skip,
    orderBy,
    include: toolManyPayload,
  })

  const toolCount = await prisma.tool.count({ where })

  return json({ tools, toolCount }, JSON_HEADERS)
}
