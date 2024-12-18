import { file } from "astro/loaders"
import { defineCollection, z } from "astro:content"

const postsCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      isDraft: z.boolean().optional(),
      title: z.string(),
      pubDate: z.date(),
      description: z.string().optional(),
      author: z.string().optional(),
      image: image().optional(),
      ogImage: image().optional(),
      tags: z.array(z.string()),
    }),
})

const advertisersCollection = defineCollection({
  loader: file("src/content/advertisers.json"),
  schema: ({ image }) => z.object({
    name: z.string(),
    description: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    logo: image().optional(),
  }),
})

const testimonialsCollection = defineCollection({
  loader: file("src/content/testimonials.json"),
  schema: ({ image }) => z.object({
    quote: z.string(),
    author: z.object({
      name: z.string(),
      title: z.string(),
      image: image().optional(),
    }),
  }),
})

export const collections = {
  posts: postsCollection,
  advertisers: advertisersCollection,
  testimonials: testimonialsCollection,
}
