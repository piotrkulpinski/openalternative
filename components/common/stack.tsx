import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { isValidElement } from "react"

import { type VariantProps, cva, cx } from "~/utils/cva"

const stackVariants = cva({
  base: "flex",

  variants: {
    size: {
      xs: "gap-1",
      sm: "gap-x-2 gap-y-1",
      md: "gap-x-3 gap-y-2",
      lg: "gap-x-4 gap-y-3",
    },
    direction: {
      row: "flex-row items-center place-content-start",
      column: "flex-col items-start",
    },
    wrap: {
      true: "flex-wrap",
      false: "",
    },
  },

  defaultVariants: {
    size: "md",
    direction: "row",
    wrap: true,
  },
})

type StackProps = ComponentProps<"div"> &
  VariantProps<typeof stackVariants> & {
    /**
     * If set to `true`, the stack will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

const Stack = ({ className, asChild, size, direction, wrap, ...props }: StackProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Comp = useAsChild ? Slot.Root : "div"

  return <Comp className={cx(stackVariants({ size, direction, wrap, className }))} {...props} />
}

export { Stack }
