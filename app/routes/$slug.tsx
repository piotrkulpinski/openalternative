import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { CopyrightIcon, GitForkIcon, HashIcon, StarIcon, TimerIcon } from "lucide-react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { format } from "timeago.js"
import { FaviconImage } from "~/components/Favicon"
import { Intro } from "~/components/Intro"
import { Series } from "~/components/Series"
import { ToolOne, toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { H3 } from "~/components/Heading"
import { Grid } from "~/components/Grid"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { Badge } from "~/components/Badge"
import { JSON_HEADERS } from "~/utils/constants"

export const handle = {
  breadcrumb: (data?: { tool: ToolOne }) => {
    if (!data) return <BackButton to="/" />

    const { slug, name } = data.tool

    return <BreadcrumbsLink to={`/${slug}`} label={name} />
  },
}

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug, isDraft: false },
      include: toolOnePayload,
    })

    return typedjson({ tool }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function ToolsPage() {
  const { tool } = useTypedLoaderData<typeof loader>()

  const insights = [
    { label: "Stars", value: tool.stars.toLocaleString(), icon: StarIcon },
    { label: "Forks", value: tool.forks.toLocaleString(), icon: GitForkIcon },
    {
      label: "Last commit",
      value: tool.lastCommitDate && format(tool.lastCommitDate),
      icon: TimerIcon,
    },
    { label: "License", value: tool.license, icon: CopyrightIcon },
  ]

  return (
    <>
      <div className="flex flex-wrap gap-12">
        <div className="flex flex-1 flex-col items-start gap-4 md:gap-6">
          <Intro
            prefix={<FaviconImage url={tool.website} />}
            title={tool.name}
            description={tool.description}
            className="gap-y-4"
          />

          {/* <Series size="lg">
            {tool.website && (
              <Button
                variant="secondary"
                prefix={<SquareArrowOutUpRightIcon className="max-sm:hidden" />}
                asChild
              >
                <Link
                  to={updateUrlWithSearchParams(tool.website, { ref: "openalternative" })}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit Website
                </Link>
              </Button>
            )}

            {tool.repository && (
              <Button variant="secondary" prefix={<GithubIcon className="max-sm:hidden" />} asChild>
                <Link to={tool.repository} target="_blank" rel="noreferrer nofollow">
                  View Repository
                </Link>
              </Button>
            )}
          </Series> */}

          {/* Topics */}
          {/* {!!tool.categories.length && (
            <Series className="w-full">
              {tool.categories?.map((category) => (
                <Badge key={category.id} to={`/categorys/${category.slug}`}>
                  <TagIcon className="size-[0.9em] stroke-[1.75] opacity-50" />
                  {category.name}
                </Badge>
              ))}
            </Series>
          )} */}
        </div>

        {/* <div className="rounded-lg border bg-neutral-50 p-6">
          <Insights insights={insights} className="text-sm" />

          {!!tool.languages.length && (
            <Series direction="column">
              <H5>Written in:</H5>

              <Series className="w-full">
                {tool.languages?.map((language) => (
                  <h5 key={language.id}>
                    <NavigationLink to={`/languages/${language.slug}`}>
                      <span className="size-2.5 rounded-full bg-red-500" />
                      {language.name}
                    </NavigationLink>
                  </h5>
                ))}
              </Series>
            </Series>
          )}
        </div> */}
      </div>

      {tool.website && (
        <div className="relative z-10 h-96 w-full self-start max-md:order-last md:rounded-md md:border md:p-1.5">
          <img
            src="https://openalternative.co/_next/image?url=https%3A%2F%2Fapi.screenshotone.com%2Ftake%3Furl%3Dhttps%253A%252F%252Fposthog.com%26cache%3Dtrue%26cache_ttl%3D2000000%26block_chats%3Dtrue%26block_trackers%3Dtrue%26block_cookie_banners%3Dtrue%26block_ads%3Dtrue%26access_key%3DoWVNWT8VvhigEQ%26signature%3D7f0e0f90b5375f79368cb0a0492ea1f04255d0757e42706ad9196f29b4829464&w=3840&q=75"
            alt=""
            width={1280}
            height={1024}
            loading="eager"
            className="size-full rounded object-cover"
          />
        </div>
      )}

      {/* Alternatives */}
      {!!tool.alternatives.length && (
        <Series size="lg" direction="column">
          <H3>{tool.name} is an Open Source alternative to:</H3>

          <Grid className="w-full">
            {tool.alternatives?.map((alternative) => (
              <AlternativeRecord key={alternative.id} alternative={alternative} />
            ))}
          </Grid>
        </Series>
      )}

      {/* Topics */}
      {!!tool.topics.length && (
        <Series size="lg" direction="column">
          <H3>Topics related to {tool.name}:</H3>

          <Series className="w-full">
            {tool.topics?.map((topic) => (
              <Badge key={topic.id} to={`/topics/${topic.slug}`}>
                <HashIcon className="size-[0.9em] stroke-[1.75] opacity-50" />
                {topic.slug}
              </Badge>
            ))}
          </Series>
        </Series>
      )}

      <BackButton to="/" />
    </>
  )
}
