import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import type { HTMLAttributes } from "react"
import { Card } from "../Card"
import { H4 } from "../Heading"
import { Post } from "content-collections"
import { formatDate } from "@curiousleaf/utils"

type PostRecordProps = HTMLAttributes<HTMLElement> & {
  post: Post
}

export const PostRecord = ({ className, post, ...props }: PostRecordProps) => {
  const to = `/blog/${post._meta.path}`
  const vt = unstable_useViewTransitionState(to)

  return (
    <Card style={{ viewTransitionName: vt ? `post-${post._meta.path}` : undefined }} asChild>
      <Link to={to} prefetch="intent" unstable_viewTransition {...props}>
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
            style={{ viewTransitionName: vt ? `post-${post._meta.path}-date` : undefined }}
          >
            <time dateTime={post.datePublished}>{formatDate(new Date(post.datePublished))}</time>
          </Card.Footer>
        )}

        {post.image && (
          <img
            src={post.image}
            alt=""
            className="-m-5 mt-0 w-[calc(100%+2.5rem)] max-w-none"
            style={{ viewTransitionName: vt ? `post-${post._meta.path}-image` : undefined }}
          />
        )}
      </Link>
    </Card>
  )
}
