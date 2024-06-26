import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import { ShouldRevalidateFunction, useLoaderData } from "@remix-run/react"
import { HashIcon, MoveRightIcon, TagIcon } from "lucide-react"
import { posthog } from "posthog-js"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Button } from "~/components/Button"
import { FaviconImage } from "~/components/Favicon"
import { Grid } from "~/components/Grid"
import { H1, H4 } from "~/components/Heading"
import { Prose } from "~/components/Prose"
import { RepositoryDetails } from "~/components/RepositoryDetails"
import { Series } from "~/components/Series"
import { Tag } from "~/components/Tag"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { ToolRecord } from "~/components/records/ToolRecord"
import {
  type ToolOne,
  alternativeManyPayload,
  categoryManyPayload,
  getRelatedTools,
  languageManyPayload,
  toolOnePayload,
  topicManyPayload,
} from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS, SITE_URL } from "~/utils/constants"
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
  try {
    const timings = makeTimings("tool loader")

    const [tool, alternatives, categories, languages, topics, relatedTools] = await Promise.all([
      time(
        () =>
          prisma.tool.findUniqueOrThrow({
            where: { slug, publishedAt: { lte: new Date() } },
            include: toolOnePayload,
          }),
        { type: "find tool", timings },
      ),

      time(
        () =>
          prisma.alternativeToTool.findMany({
            where: { tool: { slug } },
            orderBy: { alternative: { name: "asc" } },
            include: { alternative: { include: alternativeManyPayload } },
          }),
        { type: "find alternatives", timings },
      ),

      time(
        () =>
          prisma.categoryToTools.findMany({
            where: { tool: { slug } },
            orderBy: { category: { name: "asc" } },
            include: { category: { include: categoryManyPayload } },
          }),
        { type: "find categories", timings },
      ),

      time(
        () =>
          prisma.languageToTool.findMany({
            where: { tool: { slug } },
            orderBy: { language: { name: "asc" } },
            include: { language: { include: languageManyPayload } },
          }),
        { type: "find languages", timings },
      ),

      time(
        () =>
          prisma.topicToTool.findMany({
            where: { tool: { slug } },
            orderBy: { topic: { slug: "asc" } },
            include: { topic: { include: topicManyPayload } },
          }),
        { type: "find topics", timings },
      ),

      time(getRelatedTools(slug, 3), { type: "find related tools", timings }),
    ])

    const meta = {
      title: `${tool.name}: Open Source Alternative ${
        alternatives.length
          ? `to ${alternatives.map(({ alternative }) => alternative?.name).join(", ")}`
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
  const { tool, alternatives, categories, languages, topics, relatedTools } =
    useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col gap-12" style={{ viewTransitionName: "tool" }}>
      <div className="grid items-start gap-6 md:grid-cols-3">
        <div className="flex flex-1 flex-wrap items-start gap-10 md:col-span-2 md:gap-12">
          <div className="flex flex-1 flex-col items-start gap-4 md:gap-6">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Series size="lg" className="w-full">
                <FaviconImage
                  src={tool.faviconUrl}
                  title={tool.name}
                  style={{ viewTransitionName: "tool-favicon" }}
                />

                <H1 style={{ viewTransitionName: "tool-title" }}>{tool.name}</H1>
              </Series>

              {tool.description && (
                <Prose>
                  <h2
                    className="lead !font-normal !tracking-normal !text-secondary"
                    style={{ viewTransitionName: "tool-description" }}
                  >
                    {tool.description}
                  </h2>
                </Prose>
              )}
            </div>

            {tool.website && (
              <Button
                suffix={<MoveRightIcon className="duration-150 group-hover:translate-x-0.5" />}
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
          </div>

          <RepositoryDetails
            tool={tool}
            languages={languages}
            className="max-sm:w-full md:hidden"
          />

          {tool.screenshotUrl && (
            <img
              key={tool.screenshotUrl}
              src={tool.screenshotUrl}
              alt={`Screenshot of ${tool.name} website`}
              width={1280}
              height={1024}
              loading="eager"
              className="aspect-video h-auto w-full rounded-md border object-cover object-top"
            />
          )}

          {/* Categories */}
          {!!categories.length && (
            <Series direction="column" className="w-full">
              <H4 as="h3">Categories:</H4>

              <Series>
                {categories?.map(({ category }) => (
                  <Tag key={category.id} to={`/categories/${category.slug}`}>
                    <TagIcon className="mr-0.5 size-[0.9em] opacity-50" />
                    {category.name}
                  </Tag>
                ))}
              </Series>
            </Series>
          )}

          {/* Topics */}
          {!!topics.length && (
            <Series size="lg" direction="column" className="w-full">
              <H4 as="h3">Related topics:</H4>

              <Series className="w-full">
                {topics?.map(({ topic }) => (
                  <Tag key={topic.slug} to={`/topics/${topic.slug}`}>
                    <HashIcon className="size-[0.9em] opacity-50" />
                    {topic.slug}
                  </Tag>
                ))}
              </Series>
            </Series>
          )}
        </div>

        <div className="sticky top-14 flex flex-col gap-4 max-md:hidden">
          <RepositoryDetails tool={tool} languages={languages} />

          {/* {repo && (
            <img
              src={`https://api.star-history.com/svg?repos=${repo?.owner}/${repo?.name}&type=Date`}
              alt="Star History"
              loading="lazy"
            />
          )} */}

          {/* <SponsoredCard sponsoring={null} /> */}
        </div>
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
      {!!relatedTools.length && (
        <Series size="lg" direction="column">
          <H4 as="h3">Other Open Source Alternatives similar to {tool.name}:</H4>

          <Grid className="w-full">
            {relatedTools.map(({ tool }) => (
              <ToolRecord key={tool.id} tool={tool} />
            ))}
          </Grid>
        </Series>
      )}

      <BackButton to="/" />
    </div>
  )
}
