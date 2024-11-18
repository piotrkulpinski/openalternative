import { Link } from "@remix-run/react"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { Badge } from "~/components/ui/badge"
import { Box } from "~/components/ui/box"
import { Button } from "~/components/ui/button"
import { Container } from "~/components/ui/container"
import type { SponsoringOne } from "~/services.server/api"
import { cx } from "~/utils/cva"

type BannerProps = ComponentProps<typeof Container> & {
  sponsoring?: SponsoringOne | null
}

export const Banner = ({ className, sponsoring, ...props }: BannerProps) => {
  if (!sponsoring) return null

  return (
    <Box>
      <Container
        className={cx(
          "group/button relative -top-px inset-x-0 z-40 flex items-center justify-between gap-3 bg-card border-b py-2 hover:bg-card-dark lg:border-x lg:rounded-b-lg",
          className,
        )}
        asChild
        {...props}
      >
        <Link
          to={sponsoring.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => posthog.capture("banner_clicked", { url: sponsoring.website })}
        >
          <Badge variant="outline" className="max-sm:order-last">
            Ad
          </Badge>

          <p className="text-xs/tight text-secondary mr-auto md:text-sm/tight">
            {sponsoring.faviconUrl && (
              <img
                src={sponsoring.faviconUrl}
                alt={sponsoring.name}
                width={32}
                height={32}
                className="inline-flex align-text-top mr-1 size-3.5 md:size-4"
              />
            )}
            <strong className="font-medium text-foreground">{sponsoring.name}</strong> —{" "}
            {sponsoring.description}
          </p>

          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 pointer-events-none max-sm:hidden"
            asChild
          >
            <span>Learn More</span>
          </Button>
        </Link>
      </Container>
    </Box>
  )
}
