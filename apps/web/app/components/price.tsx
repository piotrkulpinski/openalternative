import { formatNumber } from "@curiousleaf/utils"
import NumberFlow, { type Format } from "@number-flow/react"
import type { ComponentProps } from "react"
import { Badge } from "~/components/ui/badge"
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
  format?: Format
  priceClassName?: string
}

export const Price = ({
  className,
  price,
  fullPrice,
  interval,
  discount,
  priceClassName,
  format,
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
          className={cx("!flex items-center font-semibold h-[0.9em]", priceClassName)}
          continuous
        />

        {!!fullPrice && fullPrice > price && (
          <div className="absolute -top-[1em] left-full ml-1">
            <del className="tabular-nums text-[0.9em] text-muted">
              {formatNumber(fullPrice, "standard")}
            </del>
          </div>
        )}
      </div>

      {price > 0 && interval && (
        <div className="m-[0.25em] self-end text-muted text-[0.9em] leading-none">/{interval}</div>
      )}

      {discount && (
        <Badge variant="success" className="absolute -top-3.5 right-0">
          {discount}% off
        </Badge>
      )}
    </div>
  )
}
