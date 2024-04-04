import { ActionFunctionArgs } from "@remix-run/node"
import { prisma } from "~/services.server/prisma"
import { RepositoryQueryResult, calculateHealthScore, repositoryQuery } from "~/utils/github"
import { z } from "zod"
import { graphql } from "@octokit/graphql"
import { slugify } from "@curiousleaf/utils"

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const schema = z.object({
    id: z.string(),
    owner: z.string(),
    name: z.string(),
    bump: z.number().nullable(),
  })

  const json = await request.json()
  const { id, owner, name, bump } = schema.parse(json)

  try {
    const { repository } = (await graphql({
      query: repositoryQuery,
      owner,
      name,
      headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
    }).catch(async (error) => {
      // if the repository check fails, set the tool as draft
      await prisma.tool.update({
        where: { id },
        data: { isDraft: true },
      })

      console.error(`Failed to fetch repository ${owner}/${name}`, error)
    })) as RepositoryQueryResult

    // Extract and transform the necessary metrics
    const metrics = {
      stars: repository.stargazerCount,
      forks: repository.forkCount,
      contributors: repository.mentionableUsers.totalCount,
      watchers: repository.watchers.totalCount,
      lastCommitDate: new Date(
        repository.defaultBranchRef.target.history.edges[0].node.committedDate
      ),
      bump,
    }

    const score = calculateHealthScore(metrics)
    const stars = metrics.stars
    const forks = metrics.forks
    const license =
      repository.licenseInfo.spdxId === "NOASSERTION" ? null : repository.licenseInfo.spdxId
    const lastCommitDate = metrics.lastCommitDate

    // Prepare topics data
    const topics = repository.repositoryTopics.nodes.map(({ topic }) => ({
      slug: slugify(topic.name),
    }))

    // Prepare languages data
    const languages = repository.languages.edges
      .map(({ size, node }) => ({
        percentage: Math.round((size / repository.languages.totalSize) * 100),
        name: node.name,
        slug: slugify(node.name),
        color: node.color,
      }))
      .filter(({ percentage }) => percentage > 17.5)

    // Update the tool
    return await prisma.tool.update({
      where: { id },
      data: {
        stars,
        forks,
        license,
        lastCommitDate,
        score,

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
  } catch (error) {
    console.error(`Failed to update repository ${owner}/${name}`, error)
    throw new Error(`Failed to update repository ${owner}/${name}`)
  }
}
