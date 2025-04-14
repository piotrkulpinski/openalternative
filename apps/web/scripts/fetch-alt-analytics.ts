import { db } from "@openalternative/db"
import { getPageAnalytics } from "~/lib/analytics"
import { tryCatch } from "~/utils/helpers"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
  const alternatives = await db.alternative.findMany({})

  for (const alternative of alternatives) {
    const result = await tryCatch(getPageAnalytics(`/alternatives/${alternative.slug}`))

    if (result.error) {
      console.error(`Failed to fetch analytics data for ${alternative.name}`, {
        error: result.error,
        slug: alternative.slug,
      })

      return null
    }

    await db.alternative.update({
      where: { id: alternative.id },
      data: { pageviews: result.data.pageviews ?? alternative.pageviews ?? 0 },
    })

    console.log(`Fetched analytics data for ${alternative.name}`)
  }
}

main().catch(console.error)
