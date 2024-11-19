// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
var mdxOptions = {
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
};
var posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.md",
  schema: (z) => ({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    author: z.object({
      name: z.string(),
      image: z.string(),
      twitterHandle: z.string()
    })
  }),
  transform: async (data, context) => {
    const content = await compileMDX(context, data, mdxOptions);
    return { ...data, content };
  }
});
var content_collections_default = defineConfig({
  collections: [posts]
});
export {
  content_collections_default as default
};
