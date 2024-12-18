import { Slot } from "@radix-ui/react-slot"
import type { ComponentProps } from "react"
import { isValidElement } from "react"

import { type VariantProps, cva, cx } from "~/utils/cva"

const stackVariants = cva({
  base: "flex",

  variants: {
    size: {
      xs: "gap-x-1 gap-y-0.5",
      sm: "gap-x-2 gap-y-1",
      md: "gap-x-3 gap-y-2",
      lg: "gap-x-4 gap-y-3",
    },
    direction: {
      row: "flex-row flex-wrap items-center place-content-start",
      column: "flex-col items-start",
    },
  },

  defaultVariants: {
    size: "md",
    direction: "row",
  },
})

type StackProps = ComponentProps<"div"> &
  VariantProps<typeof stackVariants> & {
    /**
     * If stack to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

const Stack = ({ className, asChild, size, direction, ...props }: StackProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Comp = useAsChild ? Slot : "div"

  return <Comp className={cx(stackVariants({ size, direction, className }))} {...props} />
}

export { Stack }
