import { type LoaderFunction, redirect } from "@remix-run/node"
import { prisma } from "~/services.server/prisma"

export const loader: LoaderFunction = async () => {
  const where = { publishedAt: { lte: new Date() } }

  // Get the count of tools that are published
  const count = await prisma.tool.count({ where })

  // Fetch a random published tool
  const randomTool = await prisma.tool.findFirst({
    where,
    orderBy: { id: "asc" },
    select: { slug: true },
    skip: Math.floor(Math.random() * count),
  })

  // If no tool is found, redirect to the home page
  if (!randomTool) {
    return redirect("/")
  }

  // Redirect to the tool's page
  return redirect(`/${randomTool.slug}`)
}
