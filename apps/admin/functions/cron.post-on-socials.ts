import { siteConfig } from "~/config/site"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { sendTweet } from "~/services/twitter"
import { DAY_IN_MS } from "~/utils/constants"

export const postOnSocials = inngest.createFunction(
  { id: "post-on-socials" },
  { cron: "TZ=Europe/Warsaw 0 10 * * *" },

  async ({ step, logger }) => {
    const tools = await step.run("fetch-tools", async () => {
      return prisma.tool.findMany({
        where: {
          publishedAt: {
            gte: new Date(new Date().getTime() - DAY_IN_MS),
            lte: new Date(),
          },
        },
      })
    })

    if (tools.length) {
      await step.run("post-on-socials", async () => {
        return Promise.all(
          tools.map(async tool => {
            logger.info(`Sending tweet about ${tool.name}`)
            await sendTweet(`${tool.name} has just been published on OpenAlternative! Congrats to the ${tool.twitterHandle ? `@${tool.twitterHandle}` : ""} team! 🎉

➡️ ${tool.tagline}

Check it out: ${siteConfig.url}/${tool.slug}`)
          }),
        )
      })
    }

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return prisma.$disconnect()
    })
  },
)
