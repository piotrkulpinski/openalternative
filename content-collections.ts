import { defineCollection, defineConfig } from "@content-collections/core"
import { type Options, compileMDX } from "@content-collections/mdx"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeSlug from "rehype-slug"

const mdxOptions: Options = {
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
}

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.{md,mdx}",

  schema: z => ({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    author: z.object({
      name: z.string(),
      image: z.string(),
      twitterHandle: z.string(),
    }),
    tools: z.array(z.string()).optional(),
  }),

  transform: async (data, context) => {
    const content = await compileMDX(context, data, mdxOptions)
    return { ...data, content }
  },
})

export default defineConfig({
  collections: [posts],
})
