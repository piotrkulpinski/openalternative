import { format } from "timeago.js"
import Link from "next/link"
import Image from "next/image"
import { Badge, Button, Card, CardPanel, Series } from "@curiousleaf/design"
import { BugIcon, ExternalLinkIcon, GitForkIcon, GithubIcon, StarIcon } from "lucide-react"
import { notFound } from "next/navigation"
import { getToolQuery, getToolsQuery } from "~/queries/tools"
import { getClient } from "~/services/apollo"
import { getScreenshotUrl } from "~/services/screenshotone"
import { Favicon } from "~/components/Favicon"
import { Box } from "~/components/Box"
import { StaticPattern } from "~/components/pattern/StaticPattern"
import { cache } from "react"
import { Metadata } from "next"
import { parseMetadata } from "~/utils/metadata"

export const dynamicParams = false

type PageParams = { params: { slug: string } }

// Getters
const getTool = cache(async (slug: string) => {
  const { data } = await getClient().query({
    query: getToolQuery,
    variables: { slug },
  })

  if (!data.tools?.[0]) {
    return notFound()
  }

  return data.tools?.[0]
})

const getMetadata = cache((tool: Awaited<ReturnType<typeof getTool>>, metadata?: Metadata) => ({
  ...metadata,
  title: `${tool.name}: Open Source Alternative ${!!tool.alternative?.length ? `to ${tool.alternative?.map((a) => a?.name).join(", ")}` : ""}`,
  description: tool.description,
}))

// Dynamic Metadata
export const generateMetadata = async ({ params: { slug } }: PageParams): Promise<Metadata> => {
  const tool = await getTool(slug)
  const url = `/tool/${slug}`

  const metadata = getMetadata(tool, {
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Static Params
export const generateStaticParams = async () => {
  const { data } = await getClient().query({
    query: getToolsQuery,
    variables: { orderBy: { score: "desc" }, filter: { isDraft: false } },
  })

  return data.tools?.map((tool) => ({ slug: tool?.slug })) ?? []
}

// Component
export default async function ToolPage({ params: { slug } }: PageParams) {
  const tool = await getTool(slug)

  const tags = [
    { name: "Categories", items: tool.category, path: "category" },
    { name: "Alternative To", items: tool.alternative, path: "alternatives-to" },
    { name: "Languages", items: tool.language, path: "language" },
    { name: "Topics", items: tool.topic, path: "topic" },
  ]

  const imageUrl = tool.website ? await getScreenshotUrl(tool.website) : null

  return (
    <Card>
      <CardPanel className="relative z-10 flex flex-wrap gap-12 p-6 md:p-8">
        <div className="flex flex-1 flex-col gap-6">
          <Series size="lg">
            <Favicon url={tool.website} />

            <h1 className="text-2xl font-semibold">{tool.name}</h1>
          </Series>

          <Series size="sm" className="md:-mt-2" asChild>
            <ul>
              {tool.stars !== null && (
                <li>
                  <Badge
                    theme="gray"
                    variant="outline"
                    prefix={<StarIcon className="max-sm:hidden" />}
                  >
                    <strong className="text-gray-700">{tool.stars.toLocaleString()}</strong> Stars
                  </Badge>
                </li>
              )}

              {tool.forks !== null && (
                <li>
                  <Badge
                    theme="gray"
                    variant="outline"
                    prefix={<GitForkIcon className="max-sm:hidden" />}
                  >
                    <strong className="text-gray-700">{tool.forks.toLocaleString()}</strong> Forks
                  </Badge>
                </li>
              )}

              {tool.issues !== null && (
                <li>
                  <Badge
                    theme="gray"
                    variant="outline"
                    prefix={<BugIcon className="max-sm:hidden" />}
                  >
                    <strong className="text-gray-700">{tool.issues.toLocaleString()}</strong> Issues
                  </Badge>
                </li>
              )}
            </ul>
          </Series>

          <div className="prose prose-lg prose-zinc !leading-relaxed text-gray-600 md:max-w-sm">
            <p>{tool.description}</p>
          </div>

          <ul className="mt-auto space-y-1 text-sm text-gray-500">
            {tool.commitDate && (
              <li>
                Last commited:{" "}
                <strong className="font-medium text-gray-600" title={tool.commitDate}>
                  {format(tool.commitDate ?? "")}
                </strong>
              </li>
            )}

            {tool.license && (
              <li>
                License: <strong className="font-medium text-gray-600">{tool.license}</strong>
              </li>
            )}
          </ul>

          <Series size="lg">
            {tool.website && (
              <Button
                theme="secondary"
                prefix={<ExternalLinkIcon className="size-4 max-sm:hidden" />}
                asChild
              >
                <Link
                  href={`${tool.website}?ref=openalternative`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Website
                </Link>
              </Button>
            )}

            {tool.repository && (
              <Button
                theme="secondary"
                variant="outline"
                prefix={<GithubIcon className="size-4 max-sm:hidden" />}
                asChild
              >
                <Link href={tool.repository} target="_blank" rel="noopener noreferrer nofollow">
                  View Repository
                </Link>
              </Button>
            )}
          </Series>
        </div>

        {imageUrl && (
          <Box className="relative z-10 self-start max-md:order-last max-md:-m-4 max-md:mt-0 md:w-2/5 lg:w-1/2">
            <Image
              src={imageUrl}
              alt=""
              width={1280}
              height={1024}
              loading="eager"
              className="h-auto w-full rounded"
            />
          </Box>
        )}

        <div className="flex w-full flex-col gap-8">
          {tags.map(
            (tag) =>
              !!tag.items?.length && (
                <Series key={tag.name} direction="column">
                  <h3 className="font-semibold">{tag.name}:</h3>

                  <Series size="sm">
                    {tag.items?.map((item) => (
                      <Link
                        key={item?.id}
                        href={`/${tag.path}/${item?.slug}`}
                        className="border-b border-purple/20 bg-purple/[0.05] px-0.5 text-black/75 hover:bg-purple/10 hover:text-black"
                      >
                        {item?.name}
                      </Link>
                    ))}
                  </Series>
                </Series>
              ),
          )}
        </div>
      </CardPanel>

      <StaticPattern
        width={76}
        height={56}
        x="50%"
        y="-6"
        squares={[[0, 1]]}
        className="bottom-auto h-96"
      />
    </Card>
  )
}
