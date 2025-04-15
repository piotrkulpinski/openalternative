import type { AdType } from "@openalternative/db/client"
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
    {
      label: "Banner Ad",
      type: "Banner",
      description: "Visible on every page of the website",
      price: 25,
      preview: "https://share.cleanshot.com/SvqTztKT",
    },
  ] satisfies AdSpot[],

  defaultAd: {
    type: "All",
    websiteUrl: "/advertise",
    name: "Advertise with us",
    description:
      "Reach out to our audience of professional open source/tech enthusiasts to boost your sales.",
    buttonLabel: "Advertise",
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

  advertisers: [
    {
      name: "Preline UI",
      description:
        "Open source set of prebuilt UI components based on the utility-first Tailwind CSS framework.",
      websiteUrl: "https://preline.co",
    },
    {
      name: "Efficient App",
      description:
        "Not all Open Source alternatives are equal — Narrow down the best, without the bullsh*t",
      websiteUrl: "https://efficient.link/ea/openalternative",
    },
    {
      name: "ScreenshotOne",
      description: "The screenshot API for developers. Render screenshots in one simple API call.",
      websiteUrl: "https://screenshotone.com/",
    },
    {
      name: "APItoolkit",
      description:
        "An API first observability platform to Observe, Debug & Test backend systems or any third party APIs.",
      websiteUrl: "https://apitoolkit.io",
    },
    {
      name: "Notesnook",
      description:
        "End-to-end encrypted note-taking app with cross-platform sync, rich text editing, and offline support for ultimate privacy and productivity.",
      websiteUrl: "https://notesnook.com",
    },
    {
      name: "Easypanel",
      description:
        "Use an intuitive interface to deploy applications, manage databases, and provision SSL certificates.",
      websiteUrl: "https://easypanel.io",
    },
    {
      name: "Polar",
      description: "An open source Lemon Squeezy alternative with 20% lower fees",
      websiteUrl: "https://polar.sh",
    },
    {
      name: "Novu",
      description: "The open-source notification infrastructure",
      websiteUrl: "https://novu.co?utm_campaign=open-alternative-p-1",
    },
  ],
}
