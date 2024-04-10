import { Intro } from "~/components/Intro"
import { MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Button } from "~/components/Button"
import { SITE_NAME } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Plan, PlanProps } from "~/components/Plan"

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
      name: "Basic",
      description: "The essentials to get you started with a directory website.",
      price: {
        amount: 47,
        interval: "month",
      },
      features: [
        { text: "Unlimited CMS items", type: "positive" },
        { text: "directoryduo.com domain", type: "positive" },
        { text: "Made in Superstash badge", type: "negative" },
      ],
    },
    {
      name: "Pro",
      description: "Take your directory website to the next level.",
      price: {
        amount: 197,
        interval: "month",
      },
      features: [
        { text: "Custom domain", type: "positive" },
        { text: "Free SSL Certificate", type: "positive" },
        { text: "Priority support", type: "positive" },
        { text: "All Basic plan features", type: "positive" },
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
            <Button variant={plan.isFeatured ? "primary" : "secondary"} className="w-full">
              Purchase
            </Button>
          </Plan>
        ))}
      </div>
    </>
  )
}
