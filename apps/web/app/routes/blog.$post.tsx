import { formatDate, getReadTime } from "@curiousleaf/utils"
import type { LoaderFunctionArgs } from "@remix-run/node"
import {
  type MetaFunction,
  json,
  unstable_useViewTransitionState,
  useLoaderData,
} from "@remix-run/react"
import { type Post, allPosts } from "content-collections"
import { SponsoringCard } from "~/components/records/sponsoring-card"
import { Author } from "~/components/ui/author"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { H6 } from "~/components/ui/heading"
import { Intro, IntroDescription, IntroTitle } from "~/components/ui/intro"
import { Markdown } from "~/components/ui/markdown"
import { Section } from "~/components/ui/section"
import { ShareButtons } from "~/components/ui/share-buttons"
import { Stack } from "~/components/ui/stack"
import { prisma } from "~/services.server/prisma"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { post: Post }) => {
    if (!data?.post) return <BackButton to="/blog" />

    const { _meta, title } = data.post

    return <BreadcrumbsLink to={`/blog/${_meta.path}`} label={title} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { post: slug } }: LoaderFunctionArgs) => {
  try {
    const post = allPosts.find(post => post._meta.path === slug)

    if (!post) throw new Error("Not Found")

    const sponsor = await prisma.alternative.findUnique({
      where: { slug: "monday" },
    })

    const meta = {
      title: `${post.title}`,
      description: post.description,
    }

    return json({ post, sponsor, meta })
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function BlogPostPage() {
  const { post, sponsor } = useLoaderData<typeof loader>()
  const vt = unstable_useViewTransitionState(`/blog/${post._meta.path}`)

  return (
    <div
      style={{ viewTransitionName: vt ? `post-${post._meta.path}` : undefined }}
      className="flex flex-col gap-8 md:gap-10 lg:gap-12"
    >
      <Intro>
        <IntroTitle
          style={{ viewTransitionName: vt ? `post-${post._meta.path}-title` : undefined }}
        >
          {post.title}
        </IntroTitle>

        <IntroDescription
          style={{ viewTransitionName: vt ? `post-${post._meta.path}-description` : undefined }}
        >
          {post.description}
        </IntroDescription>

        <Stack
          className="mt-2 text-sm text-muted"
          style={{ viewTransitionName: vt ? `post-${post._meta.path}-meta` : undefined }}
        >
          {/* <Badge size="lg" variant="outline">Uncategorized</Badge> */}

          {post.datePublished && (
            <time dateTime={post.datePublished} className="">
              {formatDate(new Date(post.datePublished))}
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
              style={{ viewTransitionName: vt ? `post-${post._meta.path}-image` : undefined }}
            />
          )}

          <Markdown>{post.content}</Markdown>

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

          {sponsor && (
            <SponsoringCard
              sponsoring={sponsor}
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
