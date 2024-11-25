import { Slot } from "@radix-ui/react-slot"
import { type ComponentProps, isValidElement } from "react"
import { H5 } from "~/components/common/heading"
import { type VariantProps, cva, cx } from "~/utils/cva"

const cardSimpleVariants = cva({
  base: "group flex justify-between items-center gap-4 min-w-0 -my-2 py-2",

  variants: {
    isRevealed: {
      true: "animate-reveal",
    },
  },

  defaultVariants: {
    isRevealed: true,
  },
})

type CardSimpleProps = ComponentProps<"div"> &
  VariantProps<typeof cardSimpleVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

const CardSimple = ({ className, isRevealed, asChild, ...props }: CardSimpleProps) => {
  const useAsChild = asChild && isValidElement(props.children)
  const Comp = useAsChild ? Slot : "div"

  return <Comp className={cx(cardSimpleVariants({ isRevealed, className }))} {...props} />
}

const CardSimpleTitle = ({ className, ...props }: ComponentProps<"h1">) => {
  return <H5 className={cx("truncate", className)} {...props} />
}

const CardSimpleDivider = ({ className, ...props }: ComponentProps<"hr">) => {
  return <hr className={cx("min-w-2 flex-1 group-hover:opacity-35", className)} {...props} />
}

const CardSimpleCaption = ({ className, ...props }: ComponentProps<"span">) => {
  return <span className={cx("shrink-0 text-xs text-secondary", className)} {...props} />
}

export { CardSimple, CardSimpleTitle, CardSimpleDivider, CardSimpleCaption }
