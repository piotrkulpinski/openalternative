import { Slot } from "@radix-ui/react-slot"
import { type ElementType, type HTMLAttributes, forwardRef, isValidElement } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

export const headingVariants = cva({
  base: "font-semibold tracking-tight text-foreground",

  variants: {
    size: {
      h1: "text-3xl text-pretty md:text-4xl",
      h2: "text-2xl md:text-3xl",
      h3: "text-2xl",
      h4: "text-xl",
      h5: "text-lg font-medium tracking-micro",
      h6: "text-base font-medium tracking-micro",
    },
  },

  defaultVariants: {
    size: "h3",
  },
})

export type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, "size"> &
  VariantProps<typeof headingVariants> & {
    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    as?: ElementType

    /**
     * If set to `true`, the button will be rendered as a child within the component.
     * This child component must be a valid React component.
     */
    asChild?: boolean
  }

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  const { className, as, asChild, size, ...rest } = props

  const useAsChild = asChild && isValidElement(rest.children)
  const Comp = useAsChild ? Slot : as ?? size ?? "h2"

  return <Comp ref={ref} className={cx(headingVariants({ size, className }))} {...rest} />
})

export const H1 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  return <Heading ref={ref} size="h1" {...props} />
})

export const H2 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  return <Heading ref={ref} size="h2" {...props} />
})

export const H3 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  return <Heading ref={ref} size="h3" {...props} />
})

export const H4 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  return <Heading ref={ref} size="h4" {...props} />
})

export const H5 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  return <Heading ref={ref} size="h5" {...props} />
})

export const H6 = forwardRef<HTMLHeadingElement, HeadingProps>((props, ref) => {
  return <Heading ref={ref} size="h6" {...props} />
})

Heading.displayName = "Heading"
H1.displayName = "H1"
H2.displayName = "H2"
H3.displayName = "H3"
H4.displayName = "H4"
H5.displayName = "H5"
H6.displayName = "H6"
