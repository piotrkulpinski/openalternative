import { Link } from "@remix-run/react"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { Badge } from "~/components/ui/badge"
import { Box } from "~/components/ui/box"
import { Button } from "~/components/ui/button"
import { Container } from "~/components/ui/container"
import { BANNER_SPONSOR } from "~/utils/constants"
import { cx } from "~/utils/cva"

export const Banner = ({ className, ...props }: ComponentProps<typeof Container>) => {
  const sponsor = BANNER_SPONSOR

  if (!sponsor) return null

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
          to={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => posthog.capture("banner_clicked", { url: sponsor.website })}
        >
          <Badge variant="outline" className="max-sm:order-last">
            Ad
          </Badge>

          <p className="text-xs/tight text-secondary mr-auto md:text-sm/tight">
            {sponsor.faviconUrl && (
              <img
                src={sponsor.faviconUrl}
                alt={sponsor.name}
                width={32}
                height={32}
                className="inline-flex align-text-top mr-1 size-3.5 md:size-4"
              />
            )}
            <strong className="font-medium text-foreground">{sponsor.name}</strong> —{" "}
            {sponsor.description}
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
