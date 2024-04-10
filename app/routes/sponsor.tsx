import { Intro } from "~/components/Intro"
import { MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Button } from "~/components/Button"
import { SITE_NAME } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Plan, PlanProps } from "~/components/Plan"
import { Card } from "~/components/Card"
import { H1 } from "~/components/Heading"
import { Grid } from "~/components/Grid"
import { BarChart3Icon } from "lucide-react"

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

  const plans = [
    {
      name: "Category Package",
      price: {
        amount: 47,
        interval: "month",
      },
      features: [
        { text: "1x category sponsor slot", type: "positive" },
        { text: "1x listing boost in the same category", type: "positive" },
        { text: "Special mention in our newsletter", type: "negative" },
      ],
    },
    {
      name: "Full Package",
      price: {
        amount: 247,
        interval: "month",
      },
      features: [
        { text: "1x homepage sponsor slot", type: "positive" },
        { text: "1x listing boost on homepage", type: "positive" },
        { text: "Special mention in our newsletter", type: "positive" },
      ],
      isFeatured: true,
    },
  ] satisfies PlanProps[]

  return (
    <>
      <Intro {...meta} />

      <div className="flex flex-wrap gap-4 max-w-2xl">
        {plans.map((plan) => (
          <Plan key={plan.name} className="flex-1" {...plan}>
            <Button variant={plan.isFeatured ? "fancy" : "secondary"} className="w-full">
              Purchase
            </Button>
          </Plan>
        ))}
      </div>

      <Intro
        title="Trusted by creators worldwide"
        description={`${SITE_NAME} is building the worlds best marketplace for the next generation of web frameworks and developer tools. of web development`}
        headingProps={{ size: "h2" }}
        className="mt-8"
      >
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

      <Grid>
        <Card>
          <H1 as="h3">500+</H1>
          <Card.Description>Visitors Per/Day</Card.Description>
        </Card>
        <Card>
          <H1 as="h3">$1000+</H1>
          <Card.Description>Affiliate Sales Per/Month</Card.Description>
        </Card>
        <Card>
          <H1 as="h3">150+</H1>
          <Card.Description>Open Source Listings</Card.Description>
        </Card>
      </Grid>
    </>
  )
}
