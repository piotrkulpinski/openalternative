import { slugify } from "@curiousleaf/utils"
import { graphql } from "@octokit/graphql"
import { inngest } from "~/services.server/inngest"
import { prisma } from "~/services.server/prisma"
import { RepositoryQueryResult, repositoryQuery, calculateHealthScore } from "~/utils/github"

export const fetchGithubRepo = inngest.createFunction(
  { id: "fetch.github-repo", retries: 0 },
  { event: "fetch.github-repo" },

  async ({ event, step, logger }) => {
    const { id, owner, name } = event.data

    const { repository } = await step
      .run("fetch-github-repo", async () => {
        return (await graphql({
          query: repositoryQuery,
          owner,
          name,
          headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
        })) as RepositoryQueryResult
      })
      .catch(async (error) => {
        logger.error(error)

        // if the susbcription check fails after all retries, unsubscribe the user
        await prisma.tool.update({
          where: { id: event.data.id },
          data: { isDraft: true },
        })

        throw new Error("Failed to fetch repository")
      })

    logger.info(`Fetched repository ${id}: ${owner}/${name}`)
    logger.info(repository.languages)

    // Extract and transform the necessary metrics
    const metrics = {
      stars: repository.stargazerCount,
      forks: repository.forkCount,
      contributors: repository.mentionableUsers.totalCount,
      watchers: repository.watchers.totalCount,
      lastCommitDate: new Date(
        repository.defaultBranchRef.target.history.edges[0].node.committedDate
      ),
    }

    const score = await step.run("calculate-health-score", async () => {
      return calculateHealthScore(metrics)
    })

    logger.info(`Health score: ${score}`)

    const tool = await step.run("update-tool", async () => {
      const stars = metrics.stars
      const forks = metrics.forks
      const license =
        repository.licenseInfo.spdxId === "NOASSERTION" ? undefined : repository.licenseInfo.spdxId
      const lastCommitDate = metrics.lastCommitDate

      const topics = repository.repositoryTopics.nodes.map(({ topic }) => ({
        slug: slugify(topic.name),
      }))

      const languages = repository.languages.edges.map(({ size, node }) => ({
        percentage: Math.round((size / repository.languages.totalSize) * 100),
        name: node.name,
        slug: slugify(node.name),
        color: node.color,
      }))

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
              where: { slug },
              create: { slug },
            })),
          },

          // Languages
          languages: {
            connectOrCreate: languages
              .filter(({ percentage }) => percentage > 17.5)
              .map(({ percentage, name, slug, color }) => ({
                where: {
                  toolId_languageSlug: {
                    toolId: id,
                    languageSlug: slug,
                  },
                },
                create: {
                  percentage,
                  // tool: { connect: { id } },
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
    })

    logger.info(`Tool updated: ${tool.id}`)

    return repository
  }
)
