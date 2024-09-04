import { formatDate, getReadTime } from "@curiousleaf/utils"
import type { LoaderFunctionArgs } from "@remix-run/node"
import {
  type MetaFunction,
  json,
  unstable_useViewTransitionState,
  useLoaderData,
} from "@remix-run/react"
import { Author } from "apps/web/app/components/Author"
import { BackButton } from "apps/web/app/components/BackButton"
import { BreadcrumbsLink } from "apps/web/app/components/Breadcrumbs"
import { H6 } from "apps/web/app/components/Heading"
import { Intro, IntroDescription, IntroTitle } from "apps/web/app/components/Intro"
import { Markdown } from "apps/web/app/components/Markdown"
import { Section } from "apps/web/app/components/Section"
import { Series } from "apps/web/app/components/Series"
import { ShareButtons } from "apps/web/app/components/ShareButtons"
import { SponsoringCard } from "apps/web/app/partials/records/SponsoringCard"
import { prisma } from "apps/web/app/services.server/prisma"
import { getMetaTags } from "apps/web/app/utils/meta"
import { type Post, allPosts } from "content-collections"

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

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
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
  } catch {
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

        <Series
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
        </Series>
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
          <Series direction="column">
            <H6 as="strong" className="text-muted">
              Written by
            </H6>

            <Author
              name={post.author.name}
              image={post.author.image}
              twitterHandle={post.author.twitterHandle}
            />
          </Series>

          {/* <TOC title="On this page" content={post.content} className="flex-1 overflow-y-auto" /> */}

          {sponsor && (
            <SponsoringCard sponsoring={sponsor} className="!animate-none max-md:hidden" />
          )}
        </Section.Sidebar>
      </Section>
    </div>
  )
}
