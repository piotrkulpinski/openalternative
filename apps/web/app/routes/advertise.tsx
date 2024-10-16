import { Slot } from "@radix-ui/react-slot"
import { type MetaFunction, json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { LightbulbIcon, MegaphoneIcon, SendIcon, SquareAsteriskIcon } from "lucide-react"
import { Sponsors } from "~/components/sponsors"
import { Stats } from "~/components/stats"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Button } from "~/components/ui/button"
import { H4 } from "~/components/ui/heading"
import { Intro, IntroDescription, IntroTitle } from "~/components/ui/intro"
import { Stack } from "~/components/ui/stack"
import { ANALYTICS_URL, SITE_EMAIL, SITE_NAME } from "~/utils/constants"
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
  const meta = {
    title: `Advertise on ${SITE_NAME}`,
    description: `Promote your business or software on ${SITE_NAME} and reach a wide audience of open source enthusiasts.`,
  }

  return json({ meta })
}

export default function AdvertisePage() {
  const { meta } = useLoaderData<typeof loader>()

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

  return (
    <>
      <Intro alignment="center">
        <IntroTitle>{meta.title}</IntroTitle>

        <IntroDescription>
          {meta.description} Check our{" "}
          <a href={ANALYTICS_URL} target="_blank" rel="noopener noreferrer nofollow">
            real-time analytics
          </a>{" "}
          to see what impact it could have on your business.
        </IntroDescription>

        <Button className="mt-4 min-w-40 self-center !text-base" asChild>
          <Link to={`mailto:${SITE_EMAIL}`}>Contact us</Link>
        </Button>
      </Intro>

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
