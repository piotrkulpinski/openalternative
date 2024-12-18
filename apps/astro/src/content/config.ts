import { file, glob } from "astro/loaders"
import { defineCollection, z } from "astro:content"

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: image().optional(),
      publishedAt: z.date(),
      updatedAt: z.string().optional(),
      author: z.object({
        name: z.string(),
        image: image().optional(),
        twitterHandle: z.string(),
      }),
    }),
})

const advertisersCollection = defineCollection({
  loader: file("src/content/advertisers.json"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string().optional(),
      websiteUrl: z.string().url().optional(),
      logo: image().optional(),
    }),
})

const testimonialsCollection = defineCollection({
  loader: file("src/content/testimonials.json"),
  schema: ({ image }) =>
    z.object({
      quote: z.string(),
      author: z.object({
        name: z.string(),
        title: z.string(),
        image: image().optional(),
      }),
    }),
})

const pressCollection = defineCollection({
  loader: file("src/content/press.json"),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      url: z.string().url().optional(),
      logo: image().optional(),
    }),
})

export const collections = {
  posts: postsCollection,
  advertisers: advertisersCollection,
  testimonials: testimonialsCollection,
  press: pressCollection,
}
