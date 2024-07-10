import { defineCollection, defineConfig } from "@content-collections/core"

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.md",
  schema: z => ({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    datePublished: z.string(),
    dateModified: z.string().optional(),
  }),
})

export default defineConfig({
  collections: [posts],
})
