import { formatDate, getReadTime } from "@curiousleaf/utils"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import type { Post } from "content-collections"
import type { HTMLAttributes } from "react"
import { Card } from "~/components/ui/card"
import { H4 } from "~/components/ui/heading"

type PostRecordProps = HTMLAttributes<HTMLElement> & {
  post: Post
}

export const PostRecord = ({ className, post, ...props }: PostRecordProps) => {
  const to = `/blog/${post._meta.path}`
  const vt = unstable_useViewTransitionState(to)

  return (
    <Card style={{ viewTransitionName: vt ? `post-${post._meta.path}` : undefined }} asChild>
      <Link to={to} prefetch="intent" unstable_viewTransition {...props}>
        {post.image && (
          <img
            src={post.image}
            alt=""
            className="-m-5 mb-0 w-[calc(100%+2.5rem)] max-w-none aspect-video object-cover"
            style={{ viewTransitionName: vt ? `post-${post._meta.path}-image` : undefined }}
          />
        )}

        <Card.Header>
          <H4
            as="h3"
            className="!leading-snug"
            style={{ viewTransitionName: vt ? `post-${post._meta.path}-title` : undefined }}
          >
            {post.title}
          </H4>
        </Card.Header>

        {post.description && (
          <Card.Description
            style={{ viewTransitionName: vt ? `post-${post._meta.path}-description` : undefined }}
          >
            {post.description}
          </Card.Description>
        )}

        {post.datePublished && (
          <Card.Footer
            style={{ viewTransitionName: vt ? `post-${post._meta.path}-meta` : undefined }}
          >
            <time dateTime={post.datePublished}>{formatDate(new Date(post.datePublished))}</time>
            <span>&bull;</span>
            <span>{getReadTime(post.content)} min read</span>
          </Card.Footer>
        )}
      </Link>
    </Card>
  )
}
