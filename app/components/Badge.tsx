import { HTMLAttributes } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const badgeVariants = cva({
  base: "rounded bg-neutral-200/60 text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-200",

  variants: {
    size: {
      sm: "px-1 py-px text-[10px]/tight",
      md: "px-1.5 py-0.5 text-xs/tight",
    },
  },

  defaultVariants: {
    size: "md",
  },
})

type BadgeProps = HTMLAttributes<HTMLElement> & VariantProps<typeof badgeVariants>

export const Badge = ({ className, size, ...props }: BadgeProps) => {
  return <span className={cx(badgeVariants({ size, className }))} {...props} />
}
