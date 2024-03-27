import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { HashIcon, MoveRightIcon, TagIcon } from "lucide-react"
import { FaviconImage } from "~/components/Favicon"
import { Series } from "~/components/Series"
import { ToolOne, toolOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { H1, H3 } from "~/components/Heading"
import { Grid } from "~/components/Grid"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { Badge } from "~/components/Badge"
import { JSON_HEADERS } from "~/utils/constants"
import { useLoaderData } from "@remix-run/react"
import { getMetaTags } from "~/utils/meta"
import { updateUrlWithSearchParams } from "~/utils/helpers"
import { Button } from "~/components/Button"
import { Prose } from "~/components/Prose"
import { RepositoryDetails } from "~/components/RepositoryDetails"
import { posthog } from "posthog-js"

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

  return (
    <div className="flex flex-col gap-12" style={{ viewTransitionName: "tool" }}>
      <div className="grid items-start gap-6 md:grid-cols-3">
        <div className="flex flex-1 flex-wrap items-start gap-10 md:col-span-2 md:gap-12">
          <div className="flex flex-1 flex-col items-start gap-4 md:gap-6">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Series size="lg" className="w-full">
                <FaviconImage
                  src={tool.faviconUrl}
                  style={{ viewTransitionName: "tool-favicon" }}
                />

                <H1 style={{ viewTransitionName: "tool-title" }}>{tool.name}</H1>
              </Series>

              {tool.description && (
                <Prose>
                  <h2
                    className="lead !font-normal !tracking-normal !text-neutral-600 dark:!text-neutral-400"
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
                  rel="noreferrer"
                >
                  View Website
                </a>
              </Button>
            )}
          </div>

          <RepositoryDetails tool={tool} className="max-sm:w-full md:hidden" />

          {tool.screenshotUrl && (
            <img
              src={tool.screenshotUrl}
              alt=""
              width={1280}
              height={1024}
              loading="eager"
              className="aspect-video h-auto w-full rounded-md border object-cover object-top dark:border-neutral-700/50"
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

        <RepositoryDetails tool={tool} className="sticky top-6 max-md:hidden" />
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
