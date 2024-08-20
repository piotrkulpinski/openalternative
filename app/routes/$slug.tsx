import { getRandomElement } from "@curiousleaf/utils"
import type { Prisma } from "@prisma/client"
import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import {
  type ShouldRevalidateFunction,
  unstable_useViewTransitionState,
  useLoaderData,
} from "@remix-run/react"
import { ArrowUpRightIcon, HashIcon, Link2Icon, ShapesIcon } from "lucide-react"
import { posthog } from "posthog-js"
import { z } from "zod"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Button } from "~/components/Button"
import { FaviconImage } from "~/components/Favicon"
import { FeedbackButton } from "~/components/FeedbackButton"
import { Grid } from "~/components/Grid"
import { H1, H4, H5 } from "~/components/Heading"
import { Markdown } from "~/components/Markdown"
import { Prose } from "~/components/Prose"
import { Series } from "~/components/Series"
import { ShareButtons } from "~/components/ShareButtons"
import { Tag } from "~/components/Tag"
import { ToolSidebar } from "~/partials/ToolSidebar"
import { AlternativeRecord } from "~/partials/records/AlternativeRecord"
import { ToolRecord } from "~/partials/records/ToolRecord"
import {
  type ToolOne,
  alternativeManyPayload,
  categoryManyPayload,
  languageManyPayload,
  toolManyPayload,
  toolOnePayload,
  topicManyPayload,
} from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { HOSTING_SPONSOR, JSON_HEADERS, SITE_URL } from "~/utils/constants"
import { joinAsSentence } from "~/utils/helpers"
import { getMetaTags } from "~/utils/meta"
import { updateUrlWithSearchParams } from "~/utils/queryString"
import { combineServerTimings, makeTimings, time } from "~/utils/timing.server"

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  currentUrl,
  nextParams,
  nextUrl,
}) => {
  return currentUrl.pathname !== nextUrl.pathname || currentParams.slug !== nextParams.slug
}

export const handle = {
  breadcrumb: (data?: { tool: ToolOne }) => {
    if (!data?.tool) return <BackButton to="/" />

    const { slug, name } = data.tool

    return <BreadcrumbsLink to={`/${slug}`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { meta, tool } = data || {}

  return getMetaTags({
    location,
    title: meta?.title,
    description: tool?.description,
    ogImage: `${SITE_URL}/${tool?.slug}.png`,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
    jsonLd: tool
      ? [
          {
            "@type": "ImageObject",
            url: tool?.screenshotUrl,
            contentUrl: tool?.screenshotUrl,
            width: 1280,
            height: 720,
            caption: `A screenshot of ${tool?.name}`,
          },
          {
            "@type": "ImageObject",
            url: tool?.faviconUrl,
            contentUrl: tool?.faviconUrl,
            width: 144,
            height: 144,
            caption: `A favicon of ${tool?.name}`,
          },
        ]
      : undefined,
  })
}

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Server-Timing": combineServerTimings(parentHeaders, loaderHeaders),
  }
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  const timings = makeTimings("tool loader")

  try {
    const [tool, alternatives, categories, languages, topics, relatedTools] = await Promise.all([
      time(
        () =>
          prisma.tool.findUniqueOrThrow({
            where: { slug },
            include: toolOnePayload,
          }),
        { type: "find tool", timings },
      ),

      time(
        () =>
          prisma.alternativeToTool.findMany({
            where: { tool: { slug } },
            orderBy: [
              { alternative: { tools: { _count: "desc" } } },
              { alternative: { name: "asc" } },
            ],
            include: { alternative: { include: alternativeManyPayload } },
          }),
        { type: "find alternatives", timings },
      ),

      time(
        () =>
          prisma.categoryToTools.findMany({
            where: { tool: { slug } },
            orderBy: [{ category: { tools: { _count: "desc" } } }, { category: { name: "asc" } }],
            include: { category: { include: categoryManyPayload } },
          }),
        { type: "find categories", timings },
      ),

      time(
        () =>
          prisma.languageToTool.findMany({
            where: { tool: { slug } },
            orderBy: [{ language: { tools: { _count: "desc" } } }, { language: { name: "asc" } }],
            include: { language: { include: languageManyPayload } },
          }),
        { type: "find languages", timings },
      ),

      time(
        () =>
          prisma.topicToTool.findMany({
            where: { tool: { slug } },
            orderBy: [{ topic: { tools: { _count: "desc" } } }, { topic: { slug: "asc" } }],
            include: { topic: { include: topicManyPayload } },
          }),
        { type: "find topics", timings },
      ),

      time(
        async () => {
          const relatedWhereClause = {
            AND: [
              { publishedAt: { lte: new Date() } },
              { slug: { not: slug } },
              { alternatives: { some: { alternative: { tools: { some: { tool: { slug } } } } } } },
            ],
          } satisfies Prisma.ToolWhereInput

          const take = 3
          const itemCount = await prisma.tool.count({ where: relatedWhereClause })
          const skip = Math.max(0, Math.floor(Math.random() * itemCount) - take)
          const properties = [
            "id",
            "name",
            "score",
          ] satisfies (keyof Prisma.ToolOrderByWithRelationInput)[]
          const orderBy = getRandomElement(properties)
          const orderDir = getRandomElement(["asc", "desc"] as const)

          return prisma.tool.findMany({
            where: relatedWhereClause,
            include: toolManyPayload,
            orderBy: { [orderBy]: orderDir },
            take,
            skip,
          })
        },
        { type: "find related tools", timings },
      ),
    ])

    const meta = {
      title: `${tool.name}: Open Source Alternative ${
        alternatives.length
          ? `to ${joinAsSentence(alternatives.map(({ alternative }) => alternative?.name))}`
          : ""
      }`,
    }

    return json(
      { meta, tool, alternatives, categories, languages, topics, relatedTools },
      { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
    )
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function ToolsPage() {
  const { meta, tool, alternatives, categories, languages, topics, relatedTools } =
    useLoaderData<typeof loader>()

  const vt = unstable_useViewTransitionState(`/${tool.slug}`)

  const links = z
    .array(z.object({ name: z.string(), url: z.string().url() }))
    .nullable()
    .parse(tool.links)

  return (
    <div
      className="flex flex-col gap-12"
      style={{ viewTransitionName: vt ? `tool-${tool.id}` : undefined }}
    >
      <div className="grid items-start gap-5 md:grid-cols-3">
        <div className="flex flex-1 flex-wrap items-start gap-10 md:col-span-2 md:gap-12">
          <div className="flex flex-1 flex-col items-start gap-4 md:gap-6">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Series size="lg" className="w-full">
                <FaviconImage
                  src={tool.faviconUrl}
                  title={tool.name}
                  style={{ viewTransitionName: vt ? `tool-${tool.id}-favicon` : undefined }}
                />

                <H1
                  className="!leading-snug"
                  style={{ viewTransitionName: vt ? `tool-${tool.id}-name` : undefined }}
                >
                  {tool.name}
                </H1>
              </Series>

              {tool.description && (
                <Prose>
                  <h2
                    className="!text-base !font-normal !tracking-normal !text-secondary md:!text-lg"
                    style={{ viewTransitionName: vt ? `tool-${tool.id}-description` : undefined }}
                  >
                    {tool.description}
                  </h2>
                </Prose>
              )}
            </div>

            {(tool.website || tool.hostingUrl) && (
              <Series size="sm">
                {tool.website && (
                  <Button
                    suffix={<ArrowUpRightIcon />}
                    onClick={() => posthog.capture("website_clicked", { url: tool.website })}
                    asChild
                  >
                    <a
                      href={updateUrlWithSearchParams(tool.website, { ref: "openalternative" })}
                      target="_blank"
                      rel="nofollow noreferrer"
                    >
                      View Website
                    </a>
                  </Button>
                )}

                {tool.hostingUrl && (
                  <Button
                    variant="secondary"
                    suffix={<ArrowUpRightIcon />}
                    onClick={() => posthog.capture("sponsoring_clicked", { url: tool.hostingUrl })}
                    asChild
                  >
                    <a
                      href={updateUrlWithSearchParams(tool.hostingUrl, { ref: "openalternative" })}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Self-host with {HOSTING_SPONSOR.name}
                    </a>
                  </Button>
                )}
              </Series>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {tool.screenshotUrl && (
              <img
                key={tool.screenshotUrl}
                src={tool.screenshotUrl}
                alt={`Screenshot of ${tool.name} website`}
                width={1280}
                height={1024}
                loading="eager"
                className="aspect-video h-auto w-full rounded-md border object-cover object-top"
                style={{ viewTransitionName: vt ? `tool-${tool.id}-screenshot` : undefined }}
              />
            )}

            <ToolSidebar tool={tool} languages={languages} className="md:hidden" />
          </div>

          {tool.content && (
            <Markdown style={{ viewTransitionName: vt ? `tool-${tool.id}-content` : undefined }}>
              {tool.content}
            </Markdown>
          )}

          {(!!links?.length || !!categories.length) && (
            <div className="grid grid-auto-fit-sm gap-x-6 gap-y-10 w-full">
              {links && (
                <Series size="lg" direction="column">
                  <H5 as="h3">Links:</H5>

                  <Series direction="column">
                    {links.map(({ name, url }) => (
                      <Tag
                        key={url}
                        to={url}
                        target="_blank"
                        rel="nofollow noreferrer"
                        prefix={<Link2Icon />}
                        suffix={<ArrowUpRightIcon />}
                      >
                        {name}
                      </Tag>
                    ))}
                  </Series>
                </Series>
              )}

              {!!categories.length && (
                <Series direction="column" className="w-full">
                  <H5 as="h3">Categories:</H5>

                  <Series direction="column">
                    {categories?.map(({ category }) => (
                      <Tag
                        key={category.id}
                        to={`/categories/${category.slug}`}
                        prefix={<ShapesIcon />}
                      >
                        {category.name}
                      </Tag>
                    ))}
                  </Series>
                </Series>
              )}
            </div>
          )}

          {/* Topics */}
          {!!topics.length && (
            <Series size="lg" direction="column" className="w-full">
              <H4 as="h3">Related topics:</H4>

              <Series>
                {topics.map(({ topic }) => (
                  <Tag key={topic.slug} to={`/topics/${topic.slug}`} prefix={<HashIcon />}>
                    {topic.slug}
                  </Tag>
                ))}
              </Series>
            </Series>
          )}

          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 w-full">
            <ShareButtons title={meta.title} />
            <FeedbackButton tool={tool} />
          </div>
        </div>

        <ToolSidebar
          tool={tool}
          languages={languages}
          className="sticky top-16 z-30 max-md:hidden"
        />
      </div>

      {/* Alternatives */}
      {!!alternatives.length && (
        <Series size="lg" direction="column">
          <H4 as="h3">{tool.name} is an Open Source alternative to:</H4>

          <Grid className="w-full">
            {alternatives?.map(({ alternative }) => (
              <AlternativeRecord key={alternative.id} alternative={alternative} />
            ))}
          </Grid>
        </Series>
      )}

      {/* Related */}
      {relatedTools.length > 0 && (
        <Series size="lg" direction="column">
          <H4 as="h3">Other Open Source Alternatives similar to {tool.name}:</H4>

          <Grid className="w-full">
            {relatedTools.map(relatedTool => (
              <ToolRecord key={relatedTool.id} tool={relatedTool} isRelated />
            ))}
          </Grid>
        </Series>
      )}

      <BackButton to="/" />
    </div>
  )
}
