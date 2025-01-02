import { formatDate, getReadTime } from "@curiousleaf/utils"
import type { Post } from "content-collections"
import Link from "next/link"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Card, CardDescription, CardFooter, CardHeader } from "~/components/web/ui/card"
import { Image } from "~/components/web/ui/image"

type PostCardProps = ComponentProps<typeof Card> & {
  post: Post
}

export const PostCard = ({ className, post, ...props }: PostCardProps) => {
  return (
    <Card className="overflow-clip" asChild {...props}>
      <Link href={`/blog/${post._meta.path}`} prefetch={false}>
        {post.image && (
          <Image
            src={post.image}
            alt=""
            className="-m-5 mb-0 w-[calc(100%+2.5rem)] max-w-none aspect-video object-cover"
          />
        )}

        <CardHeader>
          <H4 as="h3" className="leading-snug!">
            {post.title}
          </H4>
        </CardHeader>

        {post.description && <CardDescription>{post.description}</CardDescription>}

        {post.publishedAt && (
          <CardFooter>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span>&bull;</span>
            <span>{getReadTime(post.content)} min read</span>
          </CardFooter>
        )}
      </Link>
    </Card>
  )
}
