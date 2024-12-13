import { slugify } from "@curiousleaf/utils"
import type { HTMLAttributes } from "react"
import { ExternalLink } from "~/components/web/external-link"
import { config } from "~/config"
import { cx } from "~/utils/cva"
import { updateUrlWithSearchParams } from "~/utils/queryString"

export const Advertisers = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-evenly gap-6 max-w-2xl mx-auto",
        className,
      )}
      {...props}
    >
      {config.ads.advertisers.map(ad => (
        <ExternalLink
          key={ad.name}
          href={updateUrlWithSearchParams(ad.websiteUrl, { ref: "openalternative" })}
          eventName="click_ad"
          eventProps={{ url: ad.websiteUrl, type: "Advertisers" }}
          className="flex flex-wrap items-center gap-x-2 font-semibold opacity-85 hover:opacity-100 md:text-lg"
          title={ad.description}
        >
          <img
            src={`/advertisers/${slugify(ad.name)}.svg`}
            width="24"
            height="24"
            alt={ad.name}
            className="h-6 w-auto"
          />

          {ad.name}
        </ExternalLink>
      ))}
    </div>
  )
}
