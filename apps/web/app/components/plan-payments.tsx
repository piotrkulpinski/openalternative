import { cx } from "cva"
import type { ComponentProps } from "react"
import { Badge } from "~/components/ui/badge"
import { BrandStripeIcon } from "~/components/ui/icons/brand-stripe"
import { Stack } from "~/components/ui/stack"

export const PlanPayments = ({ children, className, ...props }: ComponentProps<typeof Stack>) => {
  return (
    <Stack
      direction="column"
      className={cx("place-content-center items-center text-center", className)}
      {...props}
    >
      {children}
      <Stack size="xs">
        <p className="text-xs text-muted">Payments secured by</p>

        <Badge variant="outline" prefix={<BrandStripeIcon className="rounded-sm" />}>
          Stripe
        </Badge>
      </Stack>
    </Stack>
  )
}
