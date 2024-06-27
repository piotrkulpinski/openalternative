import { slugify } from "@curiousleaf/utils"
import type { LoaderFunctionArgs } from "@remix-run/node"
import { kv } from "@vercel/kv"
import { got } from "got"
import { prisma } from "~/services.server/prisma"
import { fetchRepository } from "~/utils/github"
import { getStarCount, getSubscriberCount, getToolCount } from "~/utils/stats"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  // Store the stats in KV
  await kv.set("stats", {
    tools: await getToolCount(),
    stars: await getStarCount(),
    subscribers: await getSubscriberCount(),
  })

  // Fetch all published tools
  const tools = await prisma.tool.findMany({
    where: { publishedAt: { not: null } },
    select: { id: true, repository: true, website: true, bump: true },
  })

  // Fetch repository data for each tool
  await Promise.all(
    tools.map(async ({ id, bump, repository }) => {
      const repo = await fetchRepository(id, bump, repository)

      // Update the tool
      if (repo) {
        const { stars, forks, license, lastCommitDate, score, topics, languages } = repo

        return prisma.tool.update({
          where: { id },
          data: {
            stars,
            forks,
            lastCommitDate,
            score,

            // License
            license: license
              ? {
                  connectOrCreate: {
                    where: { name: license },
                    create: {
                      name: license,
                      slug: slugify(license).replace(/-0$/, ""),
                    },
                  },
                }
              : undefined,

            // Topics
            topics: {
              connectOrCreate: topics.map(({ slug }) => ({
                where: {
                  toolId_topicSlug: {
                    toolId: id,
                    topicSlug: slug,
                  },
                },
                create: {
                  topic: {
                    connectOrCreate: {
                      where: { slug },
                      create: { slug },
                    },
                  },
                },
              })),
            },

            // Languages
            languages: {
              connectOrCreate: languages.map(({ percentage, name, slug, color }) => ({
                where: {
                  toolId_languageSlug: {
                    toolId: id,
                    languageSlug: slug,
                  },
                },
                create: {
                  percentage,
                  language: {
                    connectOrCreate: {
                      where: { slug },
                      create: { name, slug, color },
                    },
                  },
                },
              })),
            },
          },
        })
      }
    }),
  )

  // Once it's finished, clear out empty languages and topics
  await Promise.all([
    prisma.language.deleteMany({ where: { tools: { none: {} } } }),
    prisma.topic.deleteMany({ where: { tools: { none: {} } } }),
  ])

  // Run Algolia indexing
  await got.post(`https://data.us.algolia.com/1/tasks/${process.env.ALGOLIA_INDEX_TASK_ID}/run`, {
    headers: {
      "X-Algolia-API-Key": process.env.ALGOLIA_ADMIN_API_KEY,
      "X-Algolia-Application-Id": process.env.VITE_ALGOLIA_APP_ID,
    },
  })

  return new Response("OK", { status: 200 })
}
