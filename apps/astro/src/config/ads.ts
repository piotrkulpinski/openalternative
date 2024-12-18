import type { AdType } from "@openalternative/db/client"
import type { AdOne } from "~/server/ads/payloads"

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
      label: "Homepage Ad",
      type: "Homepage",
      description: "Visible on the homepage and search",
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
    website: "/advertise",
    name: "Advertise with us",
    description:
      "Reach out to our audience of professional open source/tech enthusiasts to boost your sales.",
    faviconUrl: null,
  } satisfies AdOne,
}
