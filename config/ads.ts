import type { AdType } from "@prisma/client"
import { siteConfig } from "~/config/site"
import type { AdOne } from "~/server/web/ads/payloads"

export type AdSpot = {
  label: string
  type: AdType
  description: string
  price: number
  preview?: string
}

export const adsConfig = {
  adSpots: [
    {
      label: "Listing Ad",
      type: "Tools",
      description: "Visible on the every tool listing page",
      price: 15,
      preview: "https://share.cleanshot.com/7CFqSw0b",
    },
  ] satisfies AdSpot[],

  defaultAd: {
    type: "All",
    websiteUrl: "/advertise",
    name: "Your brand here",
    description:
      "Reach out to our audience of professional open source/tech enthusiasts, boost your sales and brand awareness.",
    buttonLabel: `Advertise on ${siteConfig.name}`,
    faviconUrl: null,
  } satisfies AdOne,

  testimonials: [
    {
      quote:
        "OpenAlternative has been a solid traffic source for our website since we partnered up with them. Their homepage spot, in particular, delivered great results, giving us a noticeable **10–20% traffic boost**. Piotr has done an excellent job with OpenAlternative and it’s clear from the platform’s traffic, engagement, and audience quality. Highly recommended!",
      author: {
        name: "Abdullah Atta",
        title: "Founder of Notesnook",
        image: "/authors/abdullahatta.webp",
      },
    },
  ],
}
