import { formatNumber } from "@curiousleaf/utils"
import NumberFlow, { continuous, type Format } from "@number-flow/react"
import type { ComponentProps } from "react"
import type Stripe from "stripe"
import { Badge } from "~/components/common/badge"
import { cx } from "~/utils/cva"

const defaultFormat: Format = {
  style: "currency",
  currency: "USD",
  notation: "standard",
  maximumFractionDigits: 2,
  trailingZeroDisplay: "stripIfInteger",
}

type PriceProps = ComponentProps<"div"> & {
  price: number
  fullPrice?: number | null
  interval?: string
  discount?: number | null
  coupon?: Stripe.Coupon
  format?: Format
  priceClassName?: string
}

export const Price = ({
  className,
  price,
  fullPrice,
  interval,
  discount,
  coupon,
  format,
  priceClassName,
  ...props
}: PriceProps) => {
  return (
    <div className={cx("relative flex items-center", className)} {...props}>
      {format?.notation === "compact" && <span className="self-start mr-1 text-[0.9em]">$</span>}

      <div className="relative -tracking-wide tabular-nums font-display">
        <NumberFlow
          value={price}
          format={{ ...defaultFormat, ...format }}
          locales="en-US"
          className={cx("flex! items-center font-semibold h-[0.9em]", priceClassName)}
          plugins={[continuous]}
        />

        {!!fullPrice && fullPrice > price && (
          <div className="absolute -top-[1em] left-full ml-1">
            <span className="text-[0.9em] text-muted-foreground">
              {formatNumber(fullPrice, "standard")}
            </span>

            <span className="absolute -inset-x-0.5 top-1/2 h-[0.1em] -rotate-10 bg-red-500/50" />
          </div>
        )}
      </div>

      {price > 0 && interval && (
        <div className="m-[0.25em] self-end text-muted-foreground text-[0.9em] leading-none">
          /{interval}
        </div>
      )}

      {!!discount && (
        <Badge variant="success" className="absolute -top-3.5 right-0">
          {discount}% off
          {coupon?.max_redemptions && (
            <span className="text-foreground/65">
              ({coupon.max_redemptions - coupon.times_redeemed}
              {coupon.max_redemptions > coupon.max_redemptions - coupon.times_redeemed &&
                `/${coupon.max_redemptions}`}{" "}
              left)
            </span>
          )}
        </Badge>
      )}
    </div>
  )
}
