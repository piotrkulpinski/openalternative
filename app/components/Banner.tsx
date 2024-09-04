import { Link } from "@remix-run/react"
import type { ComponentProps } from "react"
import { Badge } from "~/components/Badge"
import { Button } from "~/components/Button"
import { Container } from "~/components/Container"
import { BANNER_SPONSOR } from "~/utils/constants"
import { cx } from "~/utils/cva"

export const Banner = ({ className, ...props }: ComponentProps<typeof Container>) => {
  const sponsor = BANNER_SPONSOR

  return (
    <Container
      className={cx(
        "group/button relative top-0 inset-x-0 z-50 flex items-center justify-between gap-3 bg-card border-b py-2 hover:bg-card-dark lg:border-x lg:rounded-b-xl",
        className,
      )}
      asChild
      {...props}
    >
      <Link to={sponsor.website} target="_blank" rel="noopener noreferrer">
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
  )
}
