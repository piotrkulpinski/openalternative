import { allPosts } from "content-collections"
import type { Metadata } from "next"
import { cache } from "react"
import { PostCard } from "~/components/web/cards/post-card"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { parseMetadata } from "~/utils/metadata"

const getMetadata = cache(
  (metadata?: Metadata): Metadata => ({
    ...metadata,
    title: "Blog",
    description:
      "A collection of useful articles for developers and open source enthusiasts. Learn about the latest trends and technologies in the open source community.",
  }),
)

export const metadata = parseMetadata(
  getMetadata({
    alternates: { canonical: "/blog" },
    openGraph: { url: "/blog" },
  }),
)

export default function BlogPage() {
  const { title, description } = getMetadata()
  const posts = allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <>
      <Intro>
        <IntroTitle>{title?.toString()}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      {posts.length ? (
        <Grid size="lg">
          {allPosts.map(post => (
            <PostCard key={post._meta.path} post={post} />
          ))}
        </Grid>
      ) : (
        <p>No posts found.</p>
      )}
    </>
  )
}
