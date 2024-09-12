import { type MetaFunction, json, useLoaderData } from "@remix-run/react"
import { allPosts } from "content-collections"
import { PostRecord } from "~/components/records/post-record"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = () => {
  const meta = {
    title: "Blog",
    description:
      "A collection of useful articles for developers and open source enthusiasts. Learn about the latest trends and technologies in the open source community.",
  }

  return json({ meta })
}

export default function BlogPage() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      {allPosts.length ? (
        <Grid size="lg">
          {allPosts.map(post => (
            <PostRecord key={post._meta.path} post={post} />
          ))}
        </Grid>
      ) : (
        <p>No posts found.</p>
      )}
    </>
  )
}
