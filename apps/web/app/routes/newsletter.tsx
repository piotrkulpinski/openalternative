import { formatNumber } from "@curiousleaf/utils"
import { type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Newsletter } from "~/components/newsletter"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/ui/intro"
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
  const meta = {
    title: "Subscribe to our Newsletter",
    description: `Join ${formatNumber(SITE_STATS.subscribers, "standard")}+ subscribers and receive our monthly newsletter packed with curated insights, project highlights, and community updates. Stay updated with the latest open source news and projects.`,
  }

  return json({ meta })
}

export default function NewsletterPage() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <Intro alignment="center">
      <IntroTitle className="max-w-xl mb-2">
        Latest Open Source Tools Delivered Straight to Your Inbox
      </IntroTitle>
      <IntroDescription>{meta.description}</IntroDescription>

      <Newsletter
        size="lg"
        className="w-full !max-w-md mx-auto items-center text-center mt-8"
        buttonProps={{ children: "Join our community", size: "lg", variant: "fancy" }}
        medium="newsletter_page"
      />

      <p className="text-sm/normal text-muted">No spam, just good stuff.</p>
    </Intro>
  )
}
