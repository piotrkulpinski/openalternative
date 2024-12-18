import { formatDate, getReadTime } from "@curiousleaf/utils"
import type { ComponentProps } from "react"
import { H4 } from "~/components/ui/heading"
import type { CollectionEntry } from "astro:content"
import { Card, CardDescription, CardFooter, CardHeader } from "~/components/ui/card"
import { cx } from "~/utils/cva"

type PostCardProps = ComponentProps<typeof Card> & {
  post: CollectionEntry<"posts">
}

export const PostCard = ({ children, className, post, ...props }: PostCardProps) => {
  return (
    <Card className={cx("overflow-clip", className)} asChild {...props}>
      <a href={`/blog/${post.id}`}>
        {children}

        <CardHeader>
          <H4 as="h3" className="leading-snug!">
            {post.data.title}
          </H4>
        </CardHeader>

        {post.data.description && <CardDescription>{post.data.description}</CardDescription>}

        {
          post.data.publishedAt && (
            <CardFooter>
              <time dateTime={post.data.publishedAt.toISOString()}>
                {formatDate(post.data.publishedAt)}
              </time>
              <span>&bull;</span>
              {post.body && <span>{getReadTime(post.body)} min read</span>}
            </CardFooter>
          )
        }
      </a>
    </Card>
  )
}
