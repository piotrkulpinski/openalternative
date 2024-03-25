import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import {
  CopyrightIcon,
  GitForkIcon,
  HashIcon,
  MoveRightIcon,
  StarIcon,
  TagIcon,
  TimerIcon,
} from "lucide-react"
import { format } from "timeago.js"
import { FaviconImage } from "~/components/Favicon"
import { Intro } from "~/components/Intro"
import { Series } from "~/components/Series"
import { ToolOne, toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { H3, H5 } from "~/components/Heading"
import { Grid } from "~/components/Grid"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { Badge } from "~/components/Badge"
import { JSON_HEADERS } from "~/utils/constants"
import { Link, useLoaderData } from "@remix-run/react"
import { getMetaTags } from "~/utils/meta"
import { updateUrlWithSearchParams } from "~/utils/helpers"
import { Button } from "~/components/Button"
import { Insights } from "~/components/Insights"
import { NavigationLink } from "~/components/NavigationLink"

export const handle = {
  breadcrumb: (data?: { tool: ToolOne }) => {
    if (!data) return <BackButton to="/" />

    const { slug, name } = data.tool

    return <BreadcrumbsLink to={`/${slug}`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { meta, tool } = data || {}

  return getMetaTags({
    title: meta?.title,
    description: tool?.description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const tool = await prisma.tool.findUniqueOrThrow({
      where: { slug, isDraft: false },
      include: toolOnePayload,
    })

    const meta = {
      title: `${tool.name}: Open Source Alternative ${tool.alternatives.length ? `to ${tool.alternatives.map((a) => a?.name).join(", ")}` : ""}`,
    }

    return json({ meta, tool }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function ToolsPage() {
  const { tool } = useLoaderData<typeof loader>()

  const insights = [
    // {
    //   label: "Repository",
    //   value: (
    //     <Link to={tool.repository ?? ""} target="_blank" rel="noreferrer nofollow">
    //       View <ArrowUpRightIcon className="inline-block size-3.5" />
    //     </Link>
    //   ),
    //   icon: GithubIcon,
    // },
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
      <div className="@3xl/main:grid-cols-3 grid items-start gap-6">
        <div className="@3xl/main:col-span-2 flex flex-1 flex-col items-start gap-10 md:gap-12">
          <div className="flex flex-col items-start gap-4 md:gap-6">
            <Intro
              prefix={<FaviconImage url={tool.website} />}
              title={tool.name}
              description={tool.description}
              className="gap-y-4"
            />

            {tool.website && (
              <Button
                suffix={<MoveRightIcon className="duration-150 group-hover:translate-x-0.5" />}
                asChild
              >
                <Link
                  to={updateUrlWithSearchParams(tool.website, { ref: "openalternative" })}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Website
                </Link>
              </Button>
            )}
          </div>

          {tool.website && (
            <div className="relative z-10 w-full self-start max-md:order-last md:rounded-md md:border md:p-1.5">
              <img
                src="https://openalternative.co/_next/image?url=https%3A%2F%2Fapi.screenshotone.com%2Ftake%3Furl%3Dhttps%253A%252F%252Fposthog.com%26cache%3Dtrue%26cache_ttl%3D2000000%26block_chats%3Dtrue%26block_trackers%3Dtrue%26block_cookie_banners%3Dtrue%26block_ads%3Dtrue%26access_key%3DoWVNWT8VvhigEQ%26signature%3D7f0e0f90b5375f79368cb0a0492ea1f04255d0757e42706ad9196f29b4829464&w=3840&q=75"
                alt=""
                width={1280}
                height={1024}
                loading="eager"
                className="aspect-video size-full rounded object-cover object-top"
              />
            </div>
          )}

          {/* Topics */}
          {!!tool.categories.length && (
            <Series direction="column">
              <H5>Categories:</H5>

              <Series>
                {tool.categories?.map((category) => (
                  <h6 key={category.id}>
                    <NavigationLink to={`/categories/${category.slug}`}>
                      <TagIcon className="size-[0.9em] stroke-[1.75] opacity-50" />
                      {category.name}
                    </NavigationLink>
                  </h6>
                ))}
              </Series>
            </Series>
          )}
        </div>

        <div className="sticky top-4 flex flex-col gap-3 rounded-lg border bg-neutral-50 px-6 py-5">
          <H5>Repository details:</H5>
          <Insights insights={insights} className="text-sm" />

          <Series direction="column">
            <H5>Written in:</H5>

            <Series>
              {tool.languages?.map((language) => (
                <h6 key={language.id}>
                  <NavigationLink to={`/languages/${language.slug}`}>
                    <span className="size-2 rounded-full bg-red-500" />
                    {language.name}
                  </NavigationLink>
                </h6>
              ))}
            </Series>
          </Series>

          {tool.repository && (
            <Button
              size="md"
              variant="secondary"
              suffix={<MoveRightIcon className="duration-150 group-hover:translate-x-0.5" />}
              className="mt-2"
              asChild
            >
              <Link to={tool.repository} target="_blank" rel="noreferrer nofollow">
                View Repository
              </Link>
            </Button>
          )}
        </div>
      </div>

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
