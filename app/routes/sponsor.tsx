import { type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { GithubIcon, HandHeartIcon, SendIcon, SquareAsteriskIcon } from "lucide-react"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Card } from "~/components/Card"
import { H4 } from "~/components/Heading"
import { Intro } from "~/components/Intro"
import { Sponsoring } from "~/components/Sponsoring"
import { prisma } from "~/services.server/prisma"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/sponsor" label="Sponsor" />,
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
  const sponsoringDates = await prisma.sponsoring.findMany({
    where: { endsAt: { gte: new Date() } },
    select: { startsAt: true, endsAt: true },
  })

  const meta = {
    title: "Supercharge your sales with sponsored listing",
    description:
      "Ensure the long-term success and growth of your business by sponsoring our comprehensive open source directory. Your support helps promote open source alternatives, fosters innovation, and makes a lasting positive impact.",
  }

  return json({ sponsoringDates, meta })
}

export default function SponsorPage() {
  const { sponsoringDates, meta } = useLoaderData<typeof loader>()

  const benefits = [
    {
      icon: <SquareAsteriskIcon className="size-full" />,
      title: "Homepage Ad",
      description: "Get featured on our homepage with a banner ad linking to your website.",
      stats: {
        value: 500,
        label: "Visitors/day",
      },
    },
    {
      icon: <HandHeartIcon className="size-full" />,
      title: "Support OSS",
      description: "Support the open-source community and help us maintain the directory.",
      stats: {
        value: 220,
        label: "Listed Projects",
      },
    },
    {
      icon: <SendIcon className="size-full" />,
      title: "Newsletter Mention",
      description: "Get featured in our monthly newsletter read by OpenSource/tech enthusiasts.",
      stats: {
        value: 700,
        label: "Subscribers",
      },
      exclusive: true,
    },
    {
      icon: <GithubIcon className="size-full" />,
      title: "GitHub Link",
      description: 'Display your link in a special "Sponsors" section in our GitHub repository.',
      stats: {
        value: 500,
        label: "Stars",
      },
      exclusive: true,
    },
  ]

  return (
    <>
      <Intro {...meta} />

      <Sponsoring dates={sponsoringDates} className="max-w-2xl" />

      <div className="flex flex-col items-start gap-8 max-w-2xl mt-4">
        <Intro
          title="What do I get for sponsoring?"
          description=<>
            We offer a variety of benefits to our sponsors. Explore our{" "}
            <a
              href="https://go.openalternative.co/analytics"
              target="_blank"
              rel="noopener noreferrer"
            >
              real-time analytics
            </a>{" "}
            to see what impact sponsoring could have on your business.
          </>
          headingProps={{ size: "h2" }}
        />

        <div className="grid grid-auto-fill-xl gap-4 w-full">
          {benefits.map(benefit => (
            <Card key={benefit.title}>
              <Card.Header>
                <div className="flex size-9 items-center justify-center shrink-0 rounded-md border bg-background p-1.5">
                  {benefit.icon}
                </div>

                <H4 as="strong">
                  {benefit.title}
                  {benefit.exclusive && <span className="text-muted">*</span>}
                </H4>
              </Card.Header>

              <Card.Description>{benefit.description}</Card.Description>
              <Card.Footer>
                ~<strong>{benefit.stats.value}</strong>{" "}
                <span className="text-muted">{benefit.stats.label}</span>
              </Card.Footer>
            </Card>
          ))}
        </div>

        <p className="text-sm text-muted">
          *Available only for sponsors who purchased 30 days or more.
        </p>
      </div>
    </>
  )
}
