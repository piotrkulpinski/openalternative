import type { Logger } from "inngest/middleware/logger"
import { env } from "~/env"
import { getPlausibleApi } from "~/services/plausible"
import { tryCatch } from "~/utils/helpers"

type AnalyticsPageResponse = {
  results: { metrics: [number, number]; dimensions: [] }[]
}

/**
 * Get the page analytics for a given page and period
 * @param page - The page to get the analytics for
 * @param period - The period to get the analytics for
 * @returns The page analytics
 */
export const getPageAnalytics = async (page: string, period = "30d") => {
  const query = {
    site_id: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    metrics: ["visitors", "pageviews"],
    date_range: period,
    filters: [["is", "event:page", [page]]],
  }

  const { data, error } = await tryCatch(
    getPlausibleApi().post(query).json<AnalyticsPageResponse>(),
  )

  if (error) {
    console.error("Analytics error:", error)
    return { visitors: 0, pageviews: 0 }
  }

  return {
    visitors: data.results[0].metrics[0],
    pageviews: data.results[0].metrics[1],
  }
}

type AnalyticsTotalResponse = {
  results: { metrics: [number]; dimensions: [string] }[]
}

/**
 * Get the total analytics for a given period
 * @param period - The period to get the analytics for
 * @returns The total analytics
 */
export const getTotalAnalytics = async (period = "30d") => {
  const query = {
    site_id: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    metrics: ["visitors"],
    date_range: period,
    dimensions: ["time:day"],
  }

  const { data, error } = await tryCatch(
    getPlausibleApi().post(query).json<AnalyticsTotalResponse>(),
  )

  if (error) {
    console.error("Analytics error:", error)
    return { results: [], totalVisitors: 0, averageVisitors: 0 }
  }

  const totalVisitors = data.results.reduce((acc, curr) => acc + curr.metrics[0], 0)
  const averageVisitors = totalVisitors / data.results.length
  const results = data.results.map(({ metrics, dimensions }) => ({
    date: dimensions[0],
    visitors: metrics[0],
  }))

  return { results, totalVisitors, averageVisitors }
}

type FetchAnalyticsInBatchesParams = {
  data: {
    id: string
    name: string
    slug: string
    pageviews?: number | null
  }[]
  pathPrefix: string
  logger: Logger
  batchSize?: number
  onSuccess: (id: string, data: { pageviews: number }) => Promise<void>
}

/**
 * Fetch analytics data in batches
 * @param params - The parameters for the fetch
 */
export const fetchAnalyticsInBatches = async ({
  data,
  pathPrefix,
  logger,
  onSuccess,
  batchSize = 5,
}: FetchAnalyticsInBatchesParams) => {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async entity => {
        const result = await tryCatch(getPageAnalytics(`${pathPrefix}${entity.slug}`))

        if (result.error) {
          logger.error(`Failed to fetch analytics data for ${entity.name}`, {
            error: result.error,
            slug: entity.slug,
          })
          return null
        }

        await onSuccess(entity.id, {
          pageviews: result.data.pageviews ?? entity.pageviews ?? 0,
        })
      }),
    )
  }
}
