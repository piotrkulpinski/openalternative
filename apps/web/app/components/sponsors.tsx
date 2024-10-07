import { slugify } from "@curiousleaf/utils"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { updateUrlWithSearchParams } from "~/utils/queryString"

export const Sponsors = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const sponsors = [
    {
      name: "Preline UI",
      description:
        "Open source set of prebuilt UI components based on the utility-first Tailwind CSS framework.",
      websiteUrl: "https://preline.co",
      logo: "preline.svg",
    },
    {
      name: "Efficient App",
      description:
        "Not all Open Source alternatives are equal — Narrow down the best, without the bullsh*t",
      websiteUrl: "https://efficient.link/ea/openalternative",
      logo: "efficient-app.svg",
    },
    {
      name: "ScreenshotOne",
      description: "The screenshot API for developers. Render screenshots in one simple API call.",
      websiteUrl: "https://screenshotone.com/",
      logo: "screenshotone.svg",
    },
    {
      name: "APItoolkit",
      description:
        "An API first observability platform to Observe, Debug & Test backend systems or any third party APIs.",
      websiteUrl: "https://apitoolkit.io",
      logo: "apitoolkit.svg",
    },
    {
      name: "Notesnook",
      description:
        "End-to-end encrypted note-taking app with cross-platform sync, rich text editing, and offline support for ultimate privacy and productivity.",
      websiteUrl: "https://notesnook.com",
      logo: "notesnook.svg",
    },
    {
      name: "Easypanel",
      description:
        "Use an intuitive interface to deploy applications, manage databases, and provision SSL certificates.",
      websiteUrl: "https://easypanel.io",
      logo: "easypanel.svg",
    },
    {
      name: "Polar",
      description: "An open source Lemon Squeezy alternative with 20% lower fees",
      websiteUrl: "https://polar.sh",
      logo: "polar.svg",
    },
  ]
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-evenly gap-6 max-w-2xl mx-auto",
        className,
      )}
      {...props}
    >
      {sponsors.map(sponsor => (
        <a
          key={sponsor.name}
          href={updateUrlWithSearchParams(sponsor.websiteUrl, { ref: "openalternative" })}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-wrap items-center gap-x-2 font-semibold opacity-85 hover:opacity-100 md:text-lg"
          title={sponsor.description}
          onClick={() => posthog.capture("sponsoring_clicked", { url: sponsor.websiteUrl })}
        >
          <img
            src={`/sponsors/${slugify(sponsor.name)}.svg`}
            width="24"
            height="24"
            alt={sponsor.name}
            className="h-6 w-auto"
          />

          {sponsor.name}
        </a>
      ))}
    </div>
  )
}
