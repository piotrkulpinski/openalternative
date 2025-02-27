import Image from "next/image"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { config } from "~/config"

export const Featured = ({ ...props }: ComponentProps<"div">) => {
  return (
    <Stack direction="column" {...props}>
      <h4 className="text-[0.625rem] tracking-wide uppercase text-muted-foreground">
        As featured on
      </h4>

      <Stack className="md:gap-x-6">
        {config.links.featured.map(({ name, url, icon }) => (
          <Stack key={name} size="sm" asChild>
            <ExternalLink
              href={url}
              className="text-sm font-medium opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
            >
              <Image src={icon} alt={name} width="24" height="24" className="rounded-full" />
              <span className="max-sm:hidden">{name}</span>
            </ExternalLink>
          </Stack>
        ))}
      </Stack>
    </Stack>
  )
}
