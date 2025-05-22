import type { Ad } from "@prisma/client"
import Image from "next/image"
import type { ComponentProps } from "react"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { config } from "~/config"
import { db } from "~/services/db"
import { cx } from "~/utils/cva"

export const Advertisers = async ({ className, ...props }: ComponentProps<"div">) => {
  const ads = await db.ad.findMany({ orderBy: { createdAt: "asc" } })

  // Filter advertisers with campaigns of at least 30 days
  const longTermAds = ads.filter((ad: Ad) => {
    const durationInMs = new Date(ad.endsAt).getTime() - new Date(ad.startsAt).getTime()
    const durationInDays = durationInMs / (1000 * 60 * 60 * 24)
    return durationInDays >= 14
  })

  // Remove duplicates by name
  const advertisers = Array.from(new Map(longTermAds.map((ad: Ad) => [ad.name, ad])).values())

  return (
    <div className={cx("flex flex-col items-center text-center gap-6", className)} {...props}>
      <Note>Join these companies in advertising on {config.site.name}</Note>

      <div className="w-full overflow-clip mask-l-from-90% mask-r-from-90%">
        <div className="flex items-center gap-10 w-max animate-marquee pointer-events-none select-none">
          {[...advertisers, ...advertisers].map((ad, index) => (
            <Stack key={`${ad.name}-${index}`} size="sm" className="opacity-75" asChild>
              {ad.faviconUrl && (
                <Image
                  src={ad.faviconUrl}
                  width="24"
                  height="24"
                  alt={ad.name}
                  className="h-5.5 w-auto brightness-25 grayscale dark:brightness-200"
                />
              )}

              <strong>{ad.name}</strong>
            </Stack>
          ))}
        </div>
      </div>
    </div>
  )
}
