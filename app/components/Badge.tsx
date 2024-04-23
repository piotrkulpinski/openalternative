import { Slot } from "@radix-ui/react-slot"
import { HTMLAttributes, isValidElement } from "react"
import { VariantProps, cva, cx } from "~/utils/cva"

export const badgeVariants = cva({
  base: "rounded bg-border/50 text-secondary hover:[&[href]]:bg-border/75",

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

type BadgeProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof badgeVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

export const Badge = ({ className, asChild, size, ...props }: BadgeProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Component = useAsChild ? Slot : "span"

  return <Component className={cx(badgeVariants({ size, className }))} {...props} />
}
