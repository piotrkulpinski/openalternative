import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import type { ImageObject } from "schema-dts"
import { FeaturedTools } from "~/app/(web)/[slug]/featured-tools"
import { RelatedTools } from "~/app/(web)/[slug]/related-tools"
import { Button } from "~/components/common/button"
import { H2, H4 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { ExternalLink } from "~/components/web/external-link"
import { Listing } from "~/components/web/listing"
import { Markdown } from "~/components/web/markdown"
import { OverlayImage } from "~/components/web/overlay-image"
import { RepositoryDetails } from "~/components/web/repository-details"
import { ShareButtons } from "~/components/web/share-buttons"
import { StackList } from "~/components/web/stacks/stack-list"
import { ToolActions } from "~/components/web/tools/tool-actions"
import { ToolAlternatives } from "~/components/web/tools/tool-alternatives"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { FaviconImage } from "~/components/web/ui/favicon"
import { IntroDescription } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { Tag } from "~/components/web/ui/tag"
import { VerifiedBadge } from "~/components/web/verified-badge"
import { metadataConfig } from "~/config/metadata"
import { getToolSuffix } from "~/lib/tools"
import type { ToolOne } from "~/server/web/tools/payloads"
import { findTool, findToolSlugs } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const getTool = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const tool = await findTool({ where: { slug } })

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
          <div className="flex flex-1 flex-col items-start gap-6 max-md:order-1 md:gap-8">
            <div className="flex w-full flex-col items-start gap-y-4">
              <Stack className="w-full">
                <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8" />

                <Stack className="flex-1 min-w-0">
                  <H2 as="h1" className="!leading-tight truncate">
                    {tool.name}
                  </H2>

                  {tool.owner && <VerifiedBadge size="lg" />}
                </Stack>

                <ToolActions tool={tool} />
              </Stack>

              {tool.description && <IntroDescription>{tool.description}</IntroDescription>}
            </div>

            <ToolAlternatives alternatives={tool.alternatives} />

            <Stack className="w-full">
              <Button
                suffix={<Icon name="lucide/arrow-up-right" />}
                className="sm:min-w-36"
                asChild
              >
                <ExternalLink
                  href={tool.affiliateUrl || tool.websiteUrl}
                  doFollow={tool.isFeatured}
                  eventName="click_website"
                  eventProps={{ url: tool.websiteUrl }}
                >
                  Visit {tool.name}
                </ExternalLink>
              </Button>

              {tool.hostingUrl && (
                <Button variant="secondary" suffix={<Icon name="lucide/arrow-up-right" />} asChild>
                  <ExternalLink
                    href={tool.hostingUrl}
                    eventName="click_ad"
                    eventProps={{ url: tool.hostingUrl, type: "ToolPage" }}
                  >
                    Self-host with Easypanel
                  </ExternalLink>
                </Button>
              )}

              {tool.discountAmount && (
                <p className="pl-2 flex-1 text-sm text-balance text-green-600 dark:text-green-500">
                  {tool.discountCode
                    ? `Use code ${tool.discountCode} for ${tool.discountAmount}!`
                    : `Get ${tool.discountAmount} with our link!`}
                </p>
              )}
            </Stack>
          </div>

          {tool.screenshotUrl && (
            <OverlayImage
              href={tool.affiliateUrl || tool.websiteUrl}
              doFollow={tool.isFeatured}
              eventName="click_website"
              eventProps={{ url: tool.websiteUrl }}
              src={tool.screenshotUrl}
              alt={`Screenshot of ${tool.name} website`}
              className="max-md:order-2"
            >
              Visit {tool.name}
            </OverlayImage>
          )}

          {tool.content && <Markdown code={tool.content} className="max-md:order-5" />}

          {/* Stacks */}
          {!!tool.stacks.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-6 md:gap-y-6">
              <H4 as="strong">Technical Stack:</H4>

              <StackList stacks={tool.stacks} />
            </Stack>
          )}

          {/* Categories */}
          {!!tool.categories.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-7">
              <H4 as="strong">Categories:</H4>

              <Stack>
                {tool.categories?.map(({ name, slug, fullPath }) => (
                  <Tag
                    key={slug}
                    href={`/categories/${fullPath}`}
                    prefix={<Icon name="lucide/hash" />}
                  >
                    {name}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          {/* Topics */}
          {!!tool.topics.length && (
            <Stack size="lg" direction="column" className="w-full max-md:order-8">
              <H4 as="strong">Related topics:</H4>

              <Stack>
                {tool.topics.map(({ slug }) => (
                  <Tag key={slug} href={`/topics/${slug}`} prefix={<Icon name="lucide/hash" />}>
                    {slug}
                  </Tag>
                ))}
              </Stack>
            </Stack>
          )}

          <ShareButtons title={`${title}`} className="max-md:order-9" />
        </Section.Content>

        <Section.Sidebar className="max-md:contents">
          <RepositoryDetails tool={tool} className="max-md:order-3" />

          {/* Advertisement */}
          <Suspense fallback={<AdCardSkeleton className="max-md:order-4" />}>
            <AdCard type="ToolPage" className="max-md:order-4" />
          </Suspense>

          {/* Featured */}
          <Suspense>
            <FeaturedTools className="max-md:order-10" />
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
