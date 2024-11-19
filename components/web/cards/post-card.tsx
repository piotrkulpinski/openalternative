import { formatDate, getReadTime } from "@curiousleaf/utils"
import type { Post } from "content-collections"
import Link from "next/link"
import type { HTMLAttributes } from "react"
import { H4 } from "~/components/common/heading"
import { Card } from "~/components/web/ui/card"

type PostCardProps = HTMLAttributes<HTMLElement> & {
  post: Post
}

export const PostCard = ({ className, post, ...props }: PostCardProps) => {
  return (
    <Card asChild>
      <Link href={`/blog/${post._meta.path}`} prefetch {...props}>
        {post.image && (
          <img
            src={post.image}
            alt=""
            className="-m-5 mb-0 w-[calc(100%+2.5rem)] max-w-none aspect-video object-cover"
          />
        )}

        <Card.Header>
          <H4 as="h3" className="!leading-snug">
            {post.title}
          </H4>
        </Card.Header>

        {post.description && <Card.Description>{post.description}</Card.Description>}

        {post.publishedAt && (
          <Card.Footer>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>&bull;</span>
            <span>{getReadTime(post.content)} min read</span>
          </Card.Footer>
        )}
      </Link>
    </Card>
  )
}
