import { getRandomElement, joinAsSentence } from "@curiousleaf/utils"
import type { Prisma } from "@prisma/client"
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import {
  type ShouldRevalidateFunction,
  unstable_useViewTransitionState,
  useLoaderData,
} from "@remix-run/react"
import { ArrowUpRightIcon, HashIcon, Link2Icon, ShapesIcon } from "lucide-react"
import { posthog } from "posthog-js"
import { z } from "zod"
import { ToolBadges } from "~/components/records/tool-badges"
import { ToolRecord } from "~/components/records/tool-record"
import { ToolSidebar } from "~/components/records/tool-sidebar"
import { BackButton } from "~/components/ui/back-button"
import { Badge } from "~/components/ui/badge"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Button } from "~/components/ui/button"
import { FaviconImage } from "~/components/ui/favicon"
import { Grid } from "~/components/ui/grid"
import { H1, H4, H5 } from "~/components/ui/heading"
import { Markdown } from "~/components/ui/markdown"
import { NavigationLink } from "~/components/ui/navigation-link"
import { Prose } from "~/components/ui/prose"
import { Section } from "~/components/ui/section"
import { ShareButtons } from "~/components/ui/share-buttons"
import { Stack } from "~/components/ui/stack"
import { Tag } from "~/components/ui/tag"
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
import { getMetaTags } from "~/utils/meta"
import { updateUrlWithSearchParams } from "~/utils/queryString"

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

export const loader = async ({ request, params: { tool: slug } }: LoaderFunctionArgs) => {
  const preview = new URL(request.url).searchParams.get("preview")
  let suffix = ""

  try {
    const [tool, alternatives, categories, languages, topics, relatedTools] = await Promise.all([
      prisma.tool.findUniqueOrThrow({
        where: preview ? { id: preview, slug } : { slug, publishedAt: { lte: new Date() } },
        include: toolOnePayload,
      }),

      prisma.alternativeToTool.findMany({
        where: { tool: { slug } },
        orderBy: [{ alternative: { tools: { _count: "desc" } } }, { alternative: { name: "asc" } }],
        include: { alternative: { include: alternativeManyPayload } },
      }),

      prisma.categoryToTools.findMany({
        where: { tool: { slug } },
        orderBy: [{ category: { tools: { _count: "desc" } } }, { category: { name: "asc" } }],
        include: { category: { include: categoryManyPayload } },
      }),

      prisma.languageToTool.findMany({
        where: { tool: { slug } },
        orderBy: [{ language: { tools: { _count: "desc" } } }, { language: { name: "asc" } }],
        include: { language: { include: languageManyPayload } },
      }),

      prisma.topicToTool.findMany({
        where: { tool: { slug } },
        orderBy: [{ topic: { tools: { _count: "desc" } } }, { topic: { slug: "asc" } }],
        include: { topic: { include: topicManyPayload } },
      }),

      // Get related tools
      (async () => {
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
      })(),
    ])

    switch (alternatives.length) {
      case 0:
        suffix = `${tool.tagline}`
        break
      case 1:
        suffix = `Open Source ${alternatives[0].alternative.name} Alternative`
        break
      default:
        suffix = `Open Source Alternative to ${joinAsSentence(alternatives.map(({ alternative }) => alternative?.name))}`
    }

    const meta = {
      title: `${tool.name}: ${suffix}`,
    }

    return json(
      { meta, tool, alternatives, categories, languages, topics, relatedTools },
      { headers: { ...JSON_HEADERS } },
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
    <div className="flex flex-col gap-12">
      <Section>
        <Section.Content style={{ viewTransitionName: vt ? `tool-${tool.id}` : undefined }}>
          <div className="flex flex-1 flex-col items-start gap-4 md:gap-6">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Stack className="w-full">
                <FaviconImage
                  src={tool.faviconUrl}
                  title={tool.name}
                  style={{ viewTransitionName: vt ? `tool-${tool.id}-favicon` : undefined }}
                />

                <div className="flex flex-1">
                  <H1
                    style={{ viewTransitionName: vt ? `tool-${tool.id}-name` : undefined }}
                    className="!leading-snug truncate"
                  >
                    {tool.name}
                  </H1>
                </div>

                <ToolBadges
                  tool={tool}
                  style={{ viewTransitionName: vt ? `tool-${tool.id}-badges` : undefined }}
                >
                  {tool.discountAmount && (
                    <Badge size="lg" variant="success">
                      {tool.discountCode
                        ? `Use code ${tool.discountCode} for ${tool.discountAmount}!`
                        : `Get ${tool.discountAmount} with our link!`}
                    </Badge>
                  )}
                </ToolBadges>
              </Stack>

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

            {!!alternatives.length && (
              <>
                <h3 className="sr-only">
                  Open Source Alternative to{" "}
                  {joinAsSentence(alternatives.map(({ alternative }) => alternative?.name))}
                </h3>

                <Stack>
                  <span className="text-sm">Open Source Alternative to:</span>

                  {alternatives.map(({ alternative }) => (
                    <NavigationLink key={alternative.id} to={`/alternatives/${alternative.slug}`}>
                      {alternative.name}

                      <FaviconImage
                        src={alternative.faviconUrl}
                        title={alternative.name}
                        className="size-4 order-first"
                      />
                    </NavigationLink>
                  ))}
                </Stack>
              </>
            )}

            <Stack size="sm">
              {tool.website && (
                <Button
                  variant={tool.website.startsWith("https://go") ? "fancy" : "primary"}
                  suffix={<ArrowUpRightIcon />}
                  onClick={() => posthog.capture("website_clicked", { url: tool.website })}
                  asChild
                >
                  <a
                    href={updateUrlWithSearchParams(tool.website, { ref: "openalternative" })}
                    target="_blank"
                    rel={`noreferrer noopener ${tool.isFeatured ? "" : "nofollow"}`}
                  >
                    Visit {tool.name}
                  </a>
                </Button>
              )}

              {tool.hostingUrl && HOSTING_SPONSOR && (
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
            </Stack>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {tool.screenshotUrl && (
              <img
                key={tool.screenshotUrl}
                src={tool.screenshotUrl}
                alt={`Screenshot of ${tool.name} website`}
                width={1280}
                height={1024}
                loading="lazy"
                className="aspect-video h-auto w-full rounded-md border object-cover object-top"
                style={{ viewTransitionName: vt ? `tool-${tool.id}-screenshot` : undefined }}
              />
            )}

            <Section.Sidebar className="md:hidden">
              <ToolSidebar tool={tool} languages={languages} />
            </Section.Sidebar>
          </div>

          {tool.content && (
            <Markdown style={{ viewTransitionName: vt ? `tool-${tool.id}-content` : undefined }}>
              {tool.content}
            </Markdown>
          )}

          {(!!links?.length || !!categories.length) && (
            <div className="grid grid-auto-fit-sm gap-x-6 gap-y-10 w-full">
              {!!links?.length && (
                <Stack size="lg" direction="column">
                  <H5 as="strong">Links:</H5>

                  <Stack direction="column">
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
                  </Stack>
                </Stack>
              )}

              {!!categories.length && (
                <Stack direction="column" className="w-full">
                  <H5 as="strong">Categories:</H5>

                  <Stack direction="column">
                    {categories?.map(({ category }) => (
                      <Tag
                        key={category.id}
                        to={`/categories/${category.slug}`}
                        prefix={<ShapesIcon />}
                      >
                        {category.name}
                      </Tag>
                    ))}
                  </Stack>
                </Stack>
              )}
            </div>
          )}

          {/* Topics */}
          {!!topics.length && (
            <Stack size="lg" direction="column" className="w-full">
              <H5 as="strong">Related topics:</H5>

              <Stack>
                {topics.map(({ topic }) => (
                  <Tag key={topic.slug} to={`/topics/${topic.slug}`} prefix={<HashIcon />}>
                    {topic.slug}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          <ShareButtons title={meta.title} />
        </Section.Content>

        <Section.Sidebar className="max-md:hidden">
          <ToolSidebar tool={tool} languages={languages} />
        </Section.Sidebar>
      </Section>

      {/* Related */}
      {relatedTools.length > 0 && (
        <Stack size="lg" direction="column">
          <H4 as="h2">Similar open source alternatives:</H4>

          <Grid className="w-full">
            {relatedTools.map(relatedTool => (
              <ToolRecord key={relatedTool.id} tool={relatedTool} isRelated />
            ))}
          </Grid>
        </Stack>
      )}

      <BackButton to="/" />
    </div>
  )
}
