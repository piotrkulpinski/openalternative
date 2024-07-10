import { LoaderFunctionArgs } from "@remix-run/node"
import { json, MetaFunction, useLoaderData } from "@remix-run/react"
import { allPosts, Post } from "content-collections"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Intro } from "~/components/Intro"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { post: Post }) => {
    if (!data?.post) return <BackButton to="/" />

    const { _meta, title } = data.post

    return <BreadcrumbsLink to={`/blog/${_meta.path}`} label={title} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const post = allPosts.find(post => post._meta.path === slug)

    if (!post) throw new Error("Not Found")

    const meta = {
      title: `${post.title}`,
      description: post.description,
    }

    return json({ post, meta })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function BlogPostPage() {
  const { meta } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />
    </>
  )
}
