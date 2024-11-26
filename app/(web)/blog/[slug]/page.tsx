import { formatDate, getReadTime } from "@curiousleaf/utils"
import { type Post, allPosts } from "content-collections"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { AdCard } from "~/components/web/ads/ad-card"
import { Article } from "~/components/web/article"
import { ShareButtons } from "~/components/web/share-buttons"
import { Author } from "~/components/web/ui/author"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { findAd } from "~/server/ads/queries"
import { parseMetadata } from "~/utils/metadata"

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

const getMetadata = (post: Post) => {
  return {
    title: post.title,
    description: post.description,
  } satisfies Metadata
}

export const generateMetadata = async (props: PageProps) => {
  const post = await findPostBySlug(props)
  const url = `/blog/${post._meta.path}`

  return parseMetadata(
    Object.assign(getMetadata(post), {
      alternates: { canonical: url },
      openGraph: { url },
    }),
  )
}

export default async function BlogPostPage(props: PageProps) {
  const post = await findPostBySlug(props)
  const ad = await findAd({ where: { type: "Homepage" } })

  return (
    <div className="flex flex-col gap-8 md:gap-10 lg:gap-12">
      <Intro>
        <IntroTitle>{post.title}</IntroTitle>
        <IntroDescription>{post.description}</IntroDescription>

        <Stack className="mt-2 text-sm text-muted">
          {/* <Badge size="lg" variant="outline">Uncategorized</Badge> */}

          {post.publishedAt && (
            <time dateTime={post.publishedAt} className="">
              {formatDate(post.publishedAt)}
            </time>
          )}

          <span className="-mx-1">&bull;</span>

          <span>{getReadTime(post.content)} min read</span>
        </Stack>
      </Intro>

      <Section>
        <Section.Content>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto aspect-video object-cover rounded-lg"
            />
          )}

          <Article content={post.content} />

          <ShareButtons title={post.title} />
        </Section.Content>

        <Section.Sidebar>
          <Stack direction="column">
            <H6 as="strong" className="text-muted">
              Written by
            </H6>

            <Author
              name={post.author.name}
              image={post.author.image}
              twitterHandle={post.author.twitterHandle}
            />
          </Stack>

          {/* <TOC title="On this page" content={post.content} className="flex-1 overflow-y-auto" /> */}

          {ad && (
            <AdCard
              ad={ad}
              rel="noopener noreferrer nofollow"
              isRevealed={false}
              className="max-md:hidden"
            />
          )}
        </Section.Sidebar>
      </Section>
    </div>
  )
}
