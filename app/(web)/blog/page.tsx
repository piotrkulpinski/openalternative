import { allPosts } from "content-collections"
import type { Metadata } from "next"
import { PostCard } from "~/components/web/cards/post-card"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { parseMetadata } from "~/utils/metadata"

const metadata = {
  title: "Blog",
  description:
    "A collection of useful articles for developers and open source enthusiasts. Learn about the latest trends and technologies in the open source community.",
} satisfies Metadata

export const generateMetadata = () => {
  return parseMetadata({
    ...metadata,
    alternates: { canonical: "/blog" },
    openGraph: { url: "/blog" },
  })
}

export default function BlogPage() {
  const posts = allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
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
