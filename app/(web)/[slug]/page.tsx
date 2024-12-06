import { joinAsSentence } from "@curiousleaf/utils"
import { ArrowUpRightIcon, HashIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import type { ImageObject } from "schema-dts"
import { FeaturedTools } from "~/app/(web)/[slug]/featured-tools"
import { RelatedTools } from "~/app/(web)/[slug]/related-tools"
import { H1, H5 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { ExternalLink } from "~/components/web/external-link"
import { Listing } from "~/components/web/listing"
import { Markdown } from "~/components/web/markdown"
import { RepositoryDetails } from "~/components/web/repository-details"
import { ShareButtons } from "~/components/web/share-buttons"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import { FaviconImage } from "~/components/web/ui/favicon"
import { IntroDescription } from "~/components/web/ui/intro"
import { NavigationLink } from "~/components/web/ui/navigation-link"
import { Section } from "~/components/web/ui/section"
import { Tag } from "~/components/web/ui/tag"
import { metadataConfig } from "~/config/metadata"
import { getToolSuffix } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findToolBySlug, findToolSlugs } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const tool = await findToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  return tool
})

const getMetadata = (tool: ToolOne): Metadata => {
  return {
    title: `${tool.name}: ${getToolSuffix(tool)}`,
    description: tool.description,
  }
}

export const generateStaticParams = async () => {
  const tools = await findToolSlugs({})
  return tools.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const tool = await getTool(props)
  const url = `/${tool.slug}`

  return {
    ...getMetadata(tool),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { url, type: "website" },
  }
}

export default async function ToolPage(props: PageProps) {
  const tool = await getTool(props)
  const { title } = getMetadata(tool)
  const jsonLd: ImageObject[] = []

  if (tool.screenshotUrl) {
    jsonLd.push({
      "@type": "ImageObject",
      url: tool.screenshotUrl,
      contentUrl: tool.screenshotUrl,
      width: "1280",
      height: "720",
      caption: `A screenshot of ${tool.name}`,
    })
  }

  if (tool.faviconUrl) {
    jsonLd.push({
      "@type": "ImageObject",
      url: tool.faviconUrl,
      contentUrl: tool.faviconUrl,
      width: "144",
      height: "144",
      caption: `A favicon of ${tool.name}`,
    })
  }

  return (
    <div className="flex flex-col gap-12">
      <Section>
        <Section.Content className="max-md:contents">
          <div className="flex flex-1 flex-col items-start gap-4 max-md:order-1 md:gap-6">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Stack className="w-full">
                <FaviconImage src={tool.faviconUrl} title={tool.name} />

                <div className="flex flex-1">
                  <H1 className="!leading-snug truncate">{tool.name}</H1>
                </div>

                <ToolBadges tool={tool}>
                  {tool.discountAmount && (
                    <Badge size="lg" variant="success">
                      {tool.discountCode
                        ? `Use code ${tool.discountCode} for ${tool.discountAmount}!`
                        : `Get ${tool.discountAmount} with our link!`}
                    </Badge>
                  )}
                </ToolBadges>
              </Stack>

              {tool.description && <IntroDescription>{tool.description}</IntroDescription>}
            </div>

            {!!tool.alternatives.length && (
              <>
                <h3 className="sr-only">
                  Open Source Alternative to{" "}
                  {joinAsSentence(tool.alternatives.map(({ alternative }) => alternative?.name))}
                </h3>

                <Stack>
                  <span className="text-sm">Open Source Alternative to:</span>

                  {tool.alternatives.map(({ alternative }) => (
                    <NavigationLink
                      key={alternative.slug}
                      href={`/alternatives/${alternative.slug}`}
                    >
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
                <Button suffix={<ArrowUpRightIcon />} asChild>
                  <ExternalLink
                    href={tool.website}
                    rel={tool.isFeatured ? "noopener noreferrer" : undefined}
                    eventName="click_website"
                    eventProps={{ url: tool.website }}
                  >
                    Visit {tool.name}
                  </ExternalLink>
                </Button>
              )}

              {tool.hostingUrl && (
                <Button variant="secondary" suffix={<ArrowUpRightIcon />} asChild>
                  <ExternalLink
                    href={tool.hostingUrl}
                    eventName="click_ad"
                    eventProps={{ url: tool.hostingUrl, type: "ToolPage" }}
                  >
                    Self-host with Easypanel
                  </ExternalLink>
                </Button>
              )}
            </Stack>
          </div>

          {tool.screenshotUrl && (
            <img
              key={tool.screenshotUrl}
              src={tool.screenshotUrl}
              alt={`A screenshot of ${tool.name}`}
              width={1280}
              height={1024}
              loading="lazy"
              className="aspect-video h-auto w-full rounded-md border object-cover object-top max-md:order-2"
            />
          )}

          {tool.content && <Markdown code={tool.content} className="max-md:order-5" />}

          {/* Categories */}
          {!!tool.categories.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-6">
              <H5 as="strong">Categories:</H5>

              <Stack>
                {tool.categories?.map(({ category }) => (
                  <Tag
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    prefix={<HashIcon />}
                  >
                    {category.name}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Topics */}
          {!!tool.topics.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-7">
              <H5 as="strong">Related topics:</H5>

              <Stack>
                {tool.topics.map(({ topic }) => (
                  <Tag key={topic.slug} href={`/topics/${topic.slug}`} prefix={<HashIcon />}>
                    {topic.slug}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          <ShareButtons title={`${title}`} className="max-md:order-8" />
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
          <RepositoryDetails tool={tool} className="max-md:order-3" />

          {/* Advertisement */}
          <Suspense fallback={<AdCardSkeleton className="max-md:order-4" />}>
            <AdCard type="ToolPage" className="max-md:order-4" />
          </Suspense>

          {/* Featured */}
          <Suspense>
            <FeaturedTools className="max-md:order-9" />
          </Suspense>
        </Section.Sidebar>
      </Section>

      {/* Related */}
      <Suspense
        fallback={
          <Listing title={`Open source alternatives similar to ${tool.name}:`}>
            <ToolListSkeleton count={3} />
          </Listing>
        }
      >
        <RelatedTools tool={tool} />
      </Suspense>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
