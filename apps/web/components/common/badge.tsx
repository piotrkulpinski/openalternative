import { Slot } from "radix-ui"
import { type ComponentProps, type ReactNode, isValidElement } from "react"
import { Slottable } from "~/components/common/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"

const badgeVariants = cva({
  base: "inline-flex items-center rounded-sm text-secondary-foreground font-display font-medium leading-tight border border-transparent whitespace-nowrap",

  variants: {
    variant: {
      primary: "bg-primary text-background hover:[&[href],&[type]]:bg-primary/75",
      soft: "bg-border/50 hover:[&[href],&[type]]:bg-border/75",
      outline: "bg-background border-border hover:[&[href],&[type]]:bg-accent",
      success:
        "bg-green-100 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-100 hover:[&[href],&[type]]:opacity-75",
      warning:
        "bg-orange-100 border-orange-200 text-orange-800 dark:bg-orange-950 dark:border-orange-900 dark:text-orange-100 hover:[&[href],&[type]]:opacity-75",
      info: "bg-blue-100 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-100 hover:[&[href],&[type]]:opacity-75",
      danger:
        "bg-red-100 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-100 hover:[&[href],&[type]]:opacity-75",
    },
    size: {
      sm: "px-1 py-px gap-1 text-[0.625rem]",
      md: "px-1.5 py-0.5 gap-1.5 text-xs",
      lg: "px-2 py-1 gap-2 text-sm rounded-md",
    },
  },

  defaultVariants: {
    variant: "soft",
    size: "md",
  },
})

type BadgeProps = Omit<ComponentProps<"span">, "prefix"> &
  VariantProps<typeof badgeVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean

    /**
     * The slot to be rendered before the label.
     */
    prefix?: ReactNode

    /**
     * The slot to be rendered after the label.
     */
    suffix?: ReactNode
  }

const badgeAffixVariants = cva({
  base: "shrink-0 size-[1.1em]",
})

const Badge = ({
  children,
  className,
  asChild,
  variant,
  size,
  prefix,
  suffix,
  ...props
}: BadgeProps) => {
  const useAsChild = asChild && isValidElement(children)
  const Comp = useAsChild ? Slot.Root : "span"

  return (
    <Comp className={cx(badgeVariants({ variant, size, className }))} {...props}>
      <Slottable child={children} asChild={asChild}>
        {child => (
          <>
            {prefix && <Slot.Root className={cx(badgeAffixVariants())}>{prefix}</Slot.Root>}
            {child}
            {suffix && <Slot.Root className={cx(badgeAffixVariants())}>{suffix}</Slot.Root>}
          </>
        )}
      </Slottable>
    </Comp>
  )
}

export { Badge, badgeVariants }
