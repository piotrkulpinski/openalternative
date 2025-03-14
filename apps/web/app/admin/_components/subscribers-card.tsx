import { eachDayOfInterval, format, startOfDay, subDays } from "date-fns"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import wretch from "wretch"
import { Chart, type ChartData } from "~/app/admin/_components/chart"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"
import { env } from "~/env"

type BeehiivSubscription = {
  id: string
  email: string
  status: "active" | "validating" | "inactive" | "bounced" | "spam_complaint" | "unsubscribed"
  created: number
  subscription_tier: "free" | "premium"
  subscription_premium_tier_names: string[]
  utm_source: string
  utm_medium: string
  utm_channel: string
  utm_campaign: string
  referring_site: string
  referral_code: string
}

type SubscribersResponse = {
  data: BeehiivSubscription[]
  limit: number
  page: number
  total_results: number
  total_pages: number
}

const getSubscribers = async () => {
  "use cache"

  cacheTag("subscribers")
  cacheLife("minutes")

  const url = `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))
  const allSubscribers: BeehiivSubscription[] = []
  let currentPage = 1
  let hasMorePages = true

  const baseParams = {
    limit: "100",
    status: "active",
    order_by: "created",
    direction: "desc",
  }

  try {
    while (hasMorePages) {
      const params = new URLSearchParams({
        ...baseParams,
        page: currentPage.toString(),
      })

      const response = await wretch(`${url}?${params}`)
        .auth(`Bearer ${env.BEEHIIV_API_KEY}`)
        .get()
        .json<SubscribersResponse>()

      const subscribers = response.data
      const oldestSubscriber = subscribers[subscribers.length - 1]

      // Add only subscribers from last 30 days
      const relevantSubscribers = subscribers.filter(
        sub => new Date(sub.created * 1000) >= thirtyDaysAgo,
      )

      allSubscribers.push(...relevantSubscribers)

      // Stop if we've reached subscribers older than 30 days or no more pages
      if (
        !oldestSubscriber ||
        new Date(oldestSubscriber.created * 1000) < thirtyDaysAgo ||
        currentPage >= response.total_pages
      ) {
        hasMorePages = false
      } else {
        currentPage++
      }
    }

    // Group subscribers by date
    const subscribersByDate = allSubscribers.reduce<Record<string, number>>((acc, sub) => {
      const date = format(new Date(sub.created * 1000), "yyyy-MM-dd")
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    // Fill in missing dates with 0
    const results: ChartData[] = eachDayOfInterval({
      start: thirtyDaysAgo,
      end: new Date(),
    }).map(day => ({
      date: format(day, "yyyy-MM-dd"),
      value: subscribersByDate[format(day, "yyyy-MM-dd")] || 0,
    }))

    // Use number of subscribers from the last 30 days instead of all-time total
    const totalSubscribers = allSubscribers.length
    const averageSubscribers = results.reduce((sum, day) => sum + day.value, 0) / results.length

    return { results, totalSubscribers, averageSubscribers }
  } catch (error) {
    console.error("Subscribers error:", error)
    return { results: [], totalSubscribers: 0, averageSubscribers: 0 }
  }
}

const SubscribersCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalSubscribers, averageSubscribers } = await getSubscribers()

  return (
    <Card hover={false} focus={false} {...props}>
      <CardHeader>
        <CardDescription>Subscribers</CardDescription>
        <span className="ml-auto text-xs text-muted-foreground">last 30 days</span>
        <H2 className="w-full">{totalSubscribers.toLocaleString()}</H2>
      </CardHeader>

      <Chart
        data={results}
        average={averageSubscribers}
        className="w-full"
        cellClassName="bg-chart-2"
        label="Subscriber"
      />
    </Card>
  )
}

export { SubscribersCard }
