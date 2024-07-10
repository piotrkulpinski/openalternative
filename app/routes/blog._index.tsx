import { json, Link, MetaFunction, useLoaderData } from "@remix-run/react"
import { allPosts } from "content-collections"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
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
    title: `Blog`,
    description: `A collection of useful articles for developers and open source enthusiasts. Learn about the latest trends and technologies in the open source community.`,
  }

  return json({ meta })
}

export default function BlogPage() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      {!!allPosts.length ? (
        <Grid>
          {allPosts.map(post => (
            <li key={post._meta.path}>
              <Link to={`/blog/${post._meta.path}`} unstable_viewTransition>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </Link>
            </li>
          ))}
        </Grid>
      ) : (
        <p>No posts found.</p>
      )}
    </>
  )
}
