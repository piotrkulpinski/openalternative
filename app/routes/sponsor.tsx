import { Intro } from "~/components/Intro"
import { MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Button } from "~/components/Button"
import { SITE_NAME } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { BarChart3Icon } from "lucide-react"
import { Sponsoring } from "~/components/Sponsoring"

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = () => {
  const meta = {
    title: "Supercharge your sales with sponsored listings",
    description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`,
  }

  return json({ meta })
}

export default function SubmitPage() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta}>
        <Button variant="secondary" prefix={<BarChart3Icon />} className="mt-3" asChild>
          <a
            href="https://go.openalternative.co/analytics"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Analytics
          </a>
        </Button>
      </Intro>

      <Sponsoring className="max-w-2xl" />

      {/* <div className="grid-auto-fill-xs grid gap-4">
        <Card>
          <H1 as="h3">500+</H1>
          <Card.Description>Visitors Per/Day</Card.Description>
        </Card>
        <Card>
          <H1 as="h3">$1000+</H1>
          <Card.Description>Affiliate Sales Per/Month</Card.Description>
        </Card>
        <Card>
          <H1 as="h3">175+</H1>
          <Card.Description>Open Source Listings</Card.Description>
        </Card>
      </div> */}
    </>
  )
}
