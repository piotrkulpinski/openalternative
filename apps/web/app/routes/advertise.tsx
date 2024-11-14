import { formatNumber } from "@curiousleaf/utils"
import { Slot } from "@radix-ui/react-slot"
import { type MetaFunction, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import {
  HandHeartIcon,
  LightbulbIcon,
  MegaphoneIcon,
  SendIcon,
  SquareAsteriskIcon,
} from "lucide-react"
import { Sponsoring } from "~/components/sponsoring"
import { Sponsors } from "~/components/sponsors"
import { Stats } from "~/components/stats"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { H4 } from "~/components/ui/heading"
import { BrandGitHubIcon } from "~/components/ui/icons/brand-github"
import { Intro, IntroDescription, IntroTitle } from "~/components/ui/intro"
import { Stack } from "~/components/ui/stack"
import { prisma } from "~/services.server/prisma"
import {
  ANALYTICS_URL,
  SITE_EMAIL,
  SITE_NAME,
  SITE_STATS,
  SPONSORING_PREMIUM_TRESHOLD,
} from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/advertise" label="Advertise" />,
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
  const sponsorings = await prisma.sponsoring.findMany({
    orderBy: { createdAt: "asc" },
  })

  const meta = {
    title: `Advertise on ${SITE_NAME}`,
    description: `Promote your business or software on ${SITE_NAME} and reach a wide audience of open source enthusiasts.`,
  }

  return json({ sponsorings, meta })
}

export default function AdvertisePage() {
  const { sponsorings, meta } = useLoaderData<typeof loader>()

  const options = [
    {
      icon: <SquareAsteriskIcon />,
      title: "Featured Listings",
      description:
        "Get a prominent listing on our homepage, alternative rankings and categories. Available only for open source projects listed on our site.",
    },
    {
      icon: <MegaphoneIcon />,
      title: "Advertising Banners",
      description:
        "We offer a variety of banner ads that you can display on your website to reach our audience. You can choose where to display them.",
    },
    {
      icon: <SendIcon />,
      title: "Newsletter Sponsorship",
      description:
        "Get featured in our monthly newsletter read by tech enthusiasts. Include a personalized message to our audience with your link.",
    },
    {
      icon: <LightbulbIcon />,
      title: "Custom Marketing Plan",
      description:
        "If none of the options discussed align with your marketing strategies, please send us an email so we can discuss your specific needs.",
    },
  ]

  const benefits = [
    {
      icon: <SquareAsteriskIcon className="size-full" />,
      title: "Homepage Ad",
      description: "Get featured on our homepage with a banner ad linking to your website.",
      stats: {
        value: SITE_STATS.pageviews,
        label: "Monthly Pageviews",
      },
    },
    {
      icon: <HandHeartIcon className="size-full" />,
      title: "Support OSS",
      description: "Support the open-source community and help us maintain the directory.",
      stats: {
        value: SITE_STATS.tools,
        label: "Listed Projects",
      },
    },
    {
      icon: <SendIcon className="size-full" />,
      title: "Newsletter Mention",
      description: "Get featured in our monthly newsletter read by OpenSource/tech enthusiasts.",
      stats: {
        value: SITE_STATS.subscribers,
        label: "Subscribers",
      },
      exclusive: true,
    },
    {
      icon: <BrandGitHubIcon className="size-full" />,
      title: "GitHub Logo",
      description: 'Display your logo in a special "Sponsors" section in our GitHub repository.',
      stats: {
        value: SITE_STATS.stars,
        label: "Stars",
      },
      exclusive: true,
    },
  ]

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{meta.title}</IntroTitle>

        <IntroDescription className="max-w-3xl">
          Promote your business or software and reach a wide audience of open source enthusiasts.
          Check our{" "}
          <a href={ANALYTICS_URL} target="_blank" rel="noopener noreferrer nofollow">
            real-time analytics
          </a>{" "}
          to see what impact it could have on your business.
        </IntroDescription>
      </Intro>

      <Sponsoring dates={sponsorings} className="w-full max-w-2xl mx-auto" />

      <Stats className="my-4" />

      <Intro alignment="center" className="mt-8">
        <IntroTitle size="h2" as="h2">
          Advertising Options
        </IntroTitle>

        <IntroDescription className="mt-2">
          We only accept advertisements promoting services and products that are relevant to open
          source. They should cover informational topics or provide incentives that benefit our
          visitors.
        </IntroDescription>
      </Intro>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {options.map(option => (
          <div
            key={option.title}
            className="flex flex-col items-center gap-4 border rounded-xl px-4 py-6 text-center"
          >
            <Stack size="sm">
              <Slot className="size-6 stroke-[1.5] text-muted">{option.icon}</Slot>

              <H4 as="strong">{option.title}</H4>
            </Stack>

            <p className="max-w-sm text-secondary">{option.description}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center text-center gap-6 mt-4" id="sponsors">
        <p className="text-sm text-muted">
          Join these companies in advertising their business on {SITE_NAME}
        </p>

        <Sponsors />
      </div>

      <div className="flex flex-col items-start gap-8 max-w-2xl mt-4">
        <Intro>
          <IntroTitle size="h2">What do I get for sponsoring?</IntroTitle>

          <IntroDescription>
            We offer a variety of benefits to our sponsors. Explore our{" "}
            <a
              href="https://go.openalternative.co/analytics"
              target="_blank"
              rel="noopener noreferrer"
            >
              real-time analytics
            </a>{" "}
            to see what impact sponsoring could have on your business.
          </IntroDescription>
        </Intro>

        <div className="grid grid-auto-fill-xl gap-4 w-full">
          {benefits.map(benefit => (
            <Card key={benefit.title} hover={false}>
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
                ~{formatNumber(benefit.stats.value)} {benefit.stats.label}
              </Card.Footer>
            </Card>
          ))}
        </div>

        <p className="text-sm text-muted">
          *Available only for premium sponsors who purchased {SPONSORING_PREMIUM_TRESHOLD} days or
          more.
        </p>
      </div>

      <hr />

      <Intro alignment="center" className="md:my-4 lg:my-8">
        <IntroTitle as="h2">Ready to Learn More?</IntroTitle>

        <IntroDescription className="max-w-lg">
          Tell us more about your company and we will get back to you as soon as possible.
        </IntroDescription>

        <Button variant="fancy" className="mt-4 min-w-40 !text-base" asChild>
          <Link to={`mailto:${SITE_EMAIL}`}>Contact us</Link>
        </Button>
      </Intro>
    </>
  )
}
