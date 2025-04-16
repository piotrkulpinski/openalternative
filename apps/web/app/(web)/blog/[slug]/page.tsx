import { formatDate, getReadTime, isTruthy } from "@curiousleaf/utils"
import { type Post, allPosts } from "content-collections"
import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Suspense, cache } from "react"
import { H6 } from "~/components/common/heading"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import {
  AlternativePreview,
  AlternativePreviewSkeleton,
} from "~/components/web/alternatives/alternative-preview"
import { InlineMenu } from "~/components/web/inline-menu"
import { MDX } from "~/components/web/mdx"
import { ShareButtons } from "~/components/web/share-buttons"
import { Author } from "~/components/web/ui/author"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { FaviconImage } from "~/components/web/ui/favicon"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { metadataConfig } from "~/config/metadata"
import { findTool } from "~/server/web/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const findPostBySlug = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const post = allPosts.find(({ _meta }) => _meta.path === slug)

  if (!post) {
    notFound()
  }

  return post
})

export const generateStaticParams = () => {
  return allPosts.map(({ _meta }) => ({ slug: _meta.path }))
}

const getMetadata = (post: Post): Metadata => {
  return {
    title: post.title,
    description: post.description,
  }
}

export const generateMetadata = async (props: PageProps) => {
  const post = await findPostBySlug(props)
  const url = `/blog/${post._meta.path}`

  return {
    ...getMetadata(post),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function BlogPostPage(props: PageProps) {
  const post = await findPostBySlug(props)
  const tools = await Promise.all(post.tools?.map(slug => findTool({ where: { slug } })) ?? [])

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/blog",
            name: "Open Source Blog",
          },
          {
            href: `/blog/${post._meta.path}`,
            name: post.title,
          },
        ]}
      />

      <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
        <Intro>
          <IntroTitle>{post.title}</IntroTitle>
          <IntroDescription>{post.description}</IntroDescription>

          <Stack size="sm" className="mt-2" asChild>
            <Note>
              {/* <Badge size="lg" variant="outline">Uncategorized</Badge> */}
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="">
                  {formatDate(post.publishedAt)}
                </time>
              )}
              <span>&bull;</span>
              <span>{getReadTime(post.content)} min read</span>
            </Note>
          </Stack>
        </Intro>

        <Section>
          <Section.Content>
            {post.image && (
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full h-auto aspect-video object-cover rounded-lg"
              />
            )}

            <MDX code={post.content} />

            <ShareButtons title={post.title} />
          </Section.Content>

          <Section.Sidebar>
            <Suspense fallback={<AdCardSkeleton className="max-md:hidden" />}>
              <AdCard type="BlogPost" className="max-md:hidden" />
            </Suspense>

            <Stack direction="column" className="lg:mx-5">
              <H6 as="strong" className="text-muted-foreground">
                Written by
              </H6>

              <a
                href={`https://twitter.com/${post.author.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group"
              >
                <Author
                  name={post.author.name}
                  image={post.author.image}
                  title={`@${post.author.twitterHandle}`}
                />
              </a>
            </Stack>

            {/* <TOC title="On this page" content={post.content} className="flex-1 overflow-y-auto" /> */}

            <InlineMenu
              items={tools.filter(isTruthy).map(({ slug, name, faviconUrl }) => ({
                id: slug,
                title: name,
                prefix: <FaviconImage src={faviconUrl} title={name} className="size-4" />,
              }))}
              className="flex-1 mx-5 max-md:hidden"
            />
          </Section.Sidebar>
        </Section>
      </div>

      <Suspense fallback={<AlternativePreviewSkeleton />}>
        <AlternativePreview />
      </Suspense>
    </>
  )
}
