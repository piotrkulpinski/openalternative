import { Slot } from "@radix-ui/react-slot"
import { type HTMLAttributes, type ReactNode, isValidElement } from "react"
import { Slottable } from "~/components/ui/slottable"
import { type VariantProps, cva, cx } from "~/utils/cva"

export const badgeVariants = cva({
  base: "inline-flex items-center justify-center rounded text-secondary whitespace-nowrap",

  variants: {
    variant: {
      primary: "bg-primary text-background hover:[&[href]]:bg-primary/75",
      soft: "bg-border/50 hover:[&[href]]:bg-border/75",
      outline: "border hover:[&[href]]:bg-card-dark",
      success: "bg-green-500/15 text-green-600",
      warning: "bg-yellow-500/15 text-yellow-600",
      danger: "bg-red-500/15 text-red-600",
    },
    size: {
      sm: "px-1 py-px text-[10px]/tight",
      md: "px-1.5 py-0.5 gap-1.5 text-xs/tight",
      lg: "px-2 py-1 gap-2 text-sm/tight rounded-md",
    },
  },

  defaultVariants: {
    variant: "soft",
    size: "md",
  },
})

type BadgeProps = Omit<HTMLAttributes<HTMLElement>, "prefix"> &
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

export const badgeAffixVariants = cva({
  base: "shrink-0 size-[1.1em]",
})

export const Badge = (props: BadgeProps) => {
  const { children, className, asChild, variant, size, prefix, suffix, ...rest } = props

  const useAsChild = asChild && isValidElement(props.children)
  const Component = useAsChild ? Slot : "span"

  return (
    <Component className={cx(badgeVariants({ variant, size, className }))} {...rest}>
      <Slottable child={children} asChild={asChild}>
        {child => (
          <>
            {prefix && <Slot className={cx(badgeAffixVariants())}>{prefix}</Slot>}
            {child}
            {suffix && <Slot className={cx(badgeAffixVariants())}>{suffix}</Slot>}
          </>
        )}
      </Slottable>
    </Component>
  )
}
