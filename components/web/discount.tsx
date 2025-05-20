import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

type DiscountProps = ComponentProps<"p"> & {
  amount?: string | null
  code?: string | null
}

export const Discount = ({ className, amount, code, ...props }: DiscountProps) => {
  if (!amount) return null

  return (
    <p
      className={cx("*:font-semibold text-pretty text-green-600 dark:text-green-400", className)}
      {...props}
    >
      Get <strong>{amount}</strong> with{" "}
      {code ? (
        <>
          code <strong className="uppercase">{code}</strong>
        </>
      ) : (
        "our link"
      )}
    </p>
  )
}
