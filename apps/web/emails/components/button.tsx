import { getUrlHostname } from "@curiousleaf/utils"
import { Button, type ButtonProps, Section } from "@react-email/components"
import { siteConfig } from "~/config/site"
import { addSearchParams } from "~/utils/search-params"

export const EmailButton = ({ children, href, ...props }: ButtonProps) => {
  const emailSearchParams = { utm_source: getUrlHostname(siteConfig.url), utm_medium: "email" }

  return (
    <Section className="my-8 first:mt-0 last:mb-0">
      <Button
        className="rounded-md bg-neutral-950 px-4 py-2.5 text-center text-sm font-medium text-white no-underline"
        href={addSearchParams(href!, emailSearchParams)}
        {...props}
      >
        {children}
      </Button>
    </Section>
  )
}
