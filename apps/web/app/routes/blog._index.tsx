import { type MetaFunction, json, useLoaderData } from "@remix-run/react"
import { Grid } from "apps/web/app/components/Grid"
import { Intro } from "apps/web/app/components/Intro"
import { PostRecord } from "apps/web/app/partials/records/PostRecord"
import { getMetaTags } from "apps/web/app/utils/meta"
import { allPosts } from "content-collections"

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
