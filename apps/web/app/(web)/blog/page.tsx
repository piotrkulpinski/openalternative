import { allPosts } from "content-collections"
import type { Metadata } from "next"
import { PostCard } from "~/components/web/posts/post-card"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Open Source Blog",
  description:
    "A collection of useful articles for developers and open source enthusiasts. Learn about the latest trends and technologies in the open source community.",
  openGraph: { ...metadataConfig.openGraph, url: "/blog" },
  alternates: { ...metadataConfig.alternates, canonical: "/blog" },
}

export default function BlogPage() {
  const posts = allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/blog",
            name: "Open Source Blog",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
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
