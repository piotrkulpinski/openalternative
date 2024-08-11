import { formatDate } from "@curiousleaf/utils"
import type { LoaderFunctionArgs } from "@remix-run/node"
import {
  type MetaFunction,
  json,
  unstable_useViewTransitionState,
  useLoaderData,
} from "@remix-run/react"
import { type Post, allPosts } from "content-collections"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/Intro"
import { Markdown } from "~/components/Markdown"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { post: Post }) => {
    if (!data?.post) return <BackButton to="/" />

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

    const meta = {
      title: `${post.title}`,
      description: post.description,
    }

    return json({ post, meta })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function BlogPostPage() {
  const { post } = useLoaderData<typeof loader>()

  const vt = unstable_useViewTransitionState(`/blog/${post._meta.path}`)

  return (
    <div
      className="flex flex-col gap-12 max-w-prose"
      style={{ viewTransitionName: vt ? `post-${post._meta.path}` : undefined }}
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

        {post.datePublished && (
          <p
            style={{ viewTransitionName: vt ? `post-${post._meta.path}-date` : undefined }}
            className="mt-2 text-muted"
          >
            <time dateTime={post.datePublished}>{formatDate(new Date(post.datePublished))}</time>
          </p>
        )}
      </Intro>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto aspect-video object-cover rounded-lg"
          style={{ viewTransitionName: vt ? `post-${post._meta.path}-image` : undefined }}
        />
      )}

      <Markdown>{post.content}</Markdown>
    </div>
  )
}
