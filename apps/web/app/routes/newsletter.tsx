import { formatNumber } from "@curiousleaf/utils"
import { type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { PartyPopperIcon } from "lucide-react"
import { Newsletter } from "~/components/newsletter"
import { NewsletterProof } from "~/components/newsletter-proof"
import { ToolRecord } from "~/components/records/tool-record"
import { Badge } from "~/components/ui/badge"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Grid } from "~/components/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/ui/intro"
import { prisma } from "~/services.server/prisma"
import { SITE_STATS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/newsletter" label="Newsletter" />,
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async () => {
  const tools = await prisma.tool.findMany({
    where: { publishedAt: { lt: new Date() } },
    orderBy: { publishedAt: "desc" },
    take: 3,
  })
  const meta = {
    title: "Subscribe to our Newsletter",
    description: `Join ${formatNumber(SITE_STATS.subscribers, "standard")}+ subscribers and receive our monthly newsletter packed with curated insights, project highlights, and community updates. Stay updated with the latest open source news and projects.`,
  }

  return json({ tools, meta })
}

export default function NewsletterPage() {
  const { tools, meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro alignment="center">
        <Badge size="lg" prefix={<PartyPopperIcon />} className="text-xs/tight">
          No spam, just good stuff
        </Badge>

        <IntroTitle className="max-w-xl my-1">
          Latest Open Source Tools Delivered Straight to Your Inbox
        </IntroTitle>

        <IntroDescription>{meta.description}</IntroDescription>

        <Newsletter
          size="lg"
          className="w-full !max-w-md mx-auto items-center text-center mt-8"
          buttonProps={{ children: "Join our community", size: "lg", variant: "fancy" }}
          medium="newsletter_page"
        />

        <NewsletterProof className="mt-4" />
      </Intro>

      {!!tools.length && (
        <div className="flex flex-col gap-6 mt-8 md:mt-12 lg:mt-16">
          <Intro alignment="center">
            <IntroTitle size="h2">Recently Published Tools</IntroTitle>
          </Intro>

          <Grid>
            {tools.map(tool => (
              <ToolRecord key={tool.id} tool={tool} />
            ))}
          </Grid>
        </div>
      )}
    </>
  )
}
