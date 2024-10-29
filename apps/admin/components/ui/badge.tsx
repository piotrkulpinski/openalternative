import type * as React from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const badgeVariants = cva({
  base: "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus:outline-ring",

  variants: {
    variant: {
      default:
        "border-transparent bg-primary text-primary-foreground shadow hover:[&[href]]:bg-primary/80",
      secondary:
        "border-transparent bg-foreground/5 text-secondary-foreground hover:[&[href]]:bg-foreground/10",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground shadow hover:[&[href]]:bg-destructive/80",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cx(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
