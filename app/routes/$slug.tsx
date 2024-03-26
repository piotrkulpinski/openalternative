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
import { Series } from "~/components/Series"
import { ToolOne, toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { H1, H3, H5 } from "~/components/Heading"
import { Grid } from "~/components/Grid"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { Badge } from "~/components/Badge"
import { JSON_HEADERS } from "~/utils/constants"
import { useLoaderData } from "@remix-run/react"
import { getMetaTags } from "~/utils/meta"
import { updateUrlWithSearchParams } from "~/utils/helpers"
import { Button } from "~/components/Button"
import { Insights } from "~/components/Insights"
import { NavigationLink } from "~/components/NavigationLink"
import { Prose } from "~/components/Prose"

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
    <div className="flex flex-col gap-12" style={{ viewTransitionName: "tool" }}>
      <div className="@3xl/main:grid-cols-3 grid items-start gap-6">
        <div className="@3xl/main:col-span-2 flex flex-1 flex-col items-start gap-10 md:gap-12">
          <div className="flex flex-col items-start gap-4 md:gap-6">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Series size="lg" className="w-full">
                <FaviconImage
                  src={tool.faviconUrl}
                  style={{ viewTransitionName: `tool-favicon` }}
                />
                <H1 style={{ viewTransitionName: `tool-title` }}>{tool.name}</H1>
              </Series>

              {tool.description && (
                <Prose>
                  <h2
                    className="lead !font-normal !tracking-normal !text-neutral-600 dark:!text-neutral-400"
                    style={{ viewTransitionName: `tool-description` }}
                  >
                    {tool.description}
                  </h2>
                </Prose>
              )}
            </div>

            {tool.website && (
              <Button
                suffix={<MoveRightIcon className="duration-150 group-hover:translate-x-0.5" />}
                asChild
              >
                <a
                  href={updateUrlWithSearchParams(tool.website, { ref: "openalternative" })}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Website
                </a>
              </Button>
            )}
          </div>

          {tool.screenshotUrl && (
            <img
              src={tool.screenshotUrl}
              alt=""
              width={1280}
              height={1024}
              loading="eager"
              className="aspect-video size-full rounded-md border object-cover object-top dark:border-neutral-700/50"
            />
          )}

          {/* Categories */}
          {!!tool.categories.length && (
            <Series direction="column">
              <H3>Categories:</H3>

              <Series>
                {tool.categories?.map((category) => (
                  <Badge key={category.id} to={`/categories/${category.slug}`}>
                    <TagIcon className="mr-0.5 size-[0.9em] stroke-[1.75] opacity-50" />
                    {category.name}
                  </Badge>
                ))}
              </Series>
            </Series>
          )}

          {/* Topics */}
          {!!tool.topics.length && (
            <Series size="lg" direction="column">
              <H3>Related topics:</H3>

              <Series className="w-full">
                {tool.topics?.map((topic) => (
                  <Badge key={topic.slug} to={`/topics/${topic.slug}`}>
                    <HashIcon className="size-[0.9em] stroke-[1.75] opacity-50" />
                    {topic.slug}
                  </Badge>
                ))}
              </Series>
            </Series>
          )}
        </div>

        <div className="sticky top-4 flex flex-col gap-6">
          <div className="flex flex-col gap-5 rounded-lg border px-6 py-5 dark:border-neutral-700/50">
            <Series direction="column">
              <H5>Repository details:</H5>
              <Insights insights={insights} className="text-sm" />
            </Series>

            {!!tool.languages.length && (
              <Series direction="column">
                <H5>Written in:</H5>

                {tool.languages?.map(({ percentage, language }) => (
                  <h6 key={language.slug}>
                    <NavigationLink to={`/languages/${language.slug}`}>
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: language.color ?? undefined }}
                      />
                      {language.name} <span className="opacity-50">({percentage}%)</span>
                    </NavigationLink>
                  </h6>
                ))}
              </Series>
            )}

            {tool.repository && (
              <Button
                size="md"
                variant="secondary"
                suffix={<MoveRightIcon className="duration-150 group-hover:translate-x-0.5" />}
                className="mt-1"
                asChild
              >
                <a href={tool.repository} target="_blank" rel="noreferrer nofollow">
                  View Repository
                </a>
              </Button>
            )}
          </div>
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

      <BackButton to="/" />
    </div>
  )
}
