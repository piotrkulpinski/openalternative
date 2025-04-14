import { differenceInDays } from "date-fns"
import { revalidateTag } from "next/cache"
import { config } from "~/config"
import EmailToolExpediteReminder from "~/emails/tool-expedite-reminder"
import EmailToolScheduled from "~/emails/tool-scheduled"
import { sendEmails } from "~/lib/email"
import { generateContentWithRelations } from "~/lib/generate-content"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { getToolRepositoryData } from "~/lib/repositories"
import { analyzeRepositoryStack } from "~/lib/stack-analysis"
import { inngest } from "~/services/inngest"
import { ensureFreeSubmissions } from "~/utils/functions"

export const toolScheduled = inngest.createFunction(
  { id: "tool.scheduled", concurrency: { limit: 2 } },
  { event: "tool.scheduled" },

  async ({ event, step, db, logger }) => {
    const tool = await step.run("find-tool", async () => {
      return db.tool.findUniqueOrThrow({ where: { slug: event.data.slug } })
    })

    // Run steps in parallel
    await Promise.all([
      step.run("generate-content", async () => {
        const { categories, alternatives, ...content } = await generateContentWithRelations(
          tool.websiteUrl,
          tool.submitterNote ? `Suggested alternatives: ${tool.submitterNote}` : undefined,
        )

        return await db.tool.update({
          where: { id: tool.id },
          data: {
            ...content,
            categories: { connect: categories.map(({ id }) => ({ id })) },
            alternatives: { connect: alternatives.map(({ id }) => ({ id })) },
          },
        })
      }),

      step.run("fetch-repository-data", async () => {
        const data = await getToolRepositoryData(tool.repositoryUrl)

        if (!data) return

        return await db.tool.update({
          where: { id: tool.id },
          data,
        })
      }),

      step.run("analyze-repository-stack", async () => {
        const { id, repositoryUrl } = tool
        const { stack } = await analyzeRepositoryStack(repositoryUrl)

        return await db.tool.update({
          where: { id },
          data: { stacks: { set: stack.map(slug => ({ slug })) } },
        })
      }),

      step.run("upload-favicon", async () => {
        const { id, slug, websiteUrl } = tool
        const faviconUrl = await uploadFavicon(websiteUrl, `tools/${slug}/favicon`)

        return await db.tool.update({
          where: { id },
          data: { faviconUrl },
        })
      }),

      step.run("upload-screenshot", async () => {
        const { id, slug, websiteUrl } = tool
        const screenshotUrl = await uploadScreenshot(websiteUrl, `tools/${slug}/screenshot`)

        return await db.tool.update({
          where: { id },
          data: { screenshotUrl },
        })
      }),
    ])

    // Disconnect from DB
    await step.run("disconnect-from-db", async () => {
      return await db.$disconnect()
    })

    // Revalidate cache
    await step.run("revalidate-cache", async () => {
      revalidateTag("schedule")
      revalidateTag(`tool-${tool.slug}`)
    })

    // If no submitter email, return early
    if (!tool.submitterEmail) {
      return
    }

    const to = tool.submitterEmail

    // Send initial email
    await step.run("send-email", async () => {
      const subject = `Great news! ${tool.name} is scheduled for publication on ${config.site.name} 🎉`

      return await sendEmails({
        to,
        subject,
        react: EmailToolScheduled({ to, tool }),
      })
    })

    // Wait for 1 month and check if tool was expedited
    if (tool.publishedAt && differenceInDays(new Date(), tool.publishedAt) < 30) {
      const isFreeAfterOneMonth = await ensureFreeSubmissions(step, tool.slug, "30d")

      // Send first reminder if not expedited
      await step.run("send-first-reminder", async () => {
        if (isFreeAfterOneMonth) {
          const subject = `Skip the queue for ${tool.name} on ${config.site.name} 🚀`

          return await sendEmails({
            to,
            subject,
            react: EmailToolExpediteReminder({ to, tool, monthsWaiting: 1 }),
          })
        }
      })
    }

    // Wait for another month and check if tool was expedited
    if (tool.publishedAt && differenceInDays(new Date(), tool.publishedAt) < 60) {
      const isFreeAfterTwoMonths = await ensureFreeSubmissions(step, tool.slug, "30d")

      // Send second reminder if not expedited
      await step.run("send-second-reminder", async () => {
        if (isFreeAfterTwoMonths) {
          const subject = `Last chance to expedite ${tool.name} on ${config.site.name} ⚡️`

          return await sendEmails({
            to,
            subject,
            react: EmailToolExpediteReminder({ to, tool, monthsWaiting: 2 }),
          })
        }
      })
    }
  },
)
