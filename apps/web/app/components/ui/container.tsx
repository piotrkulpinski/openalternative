import { Slot } from "@radix-ui/react-slot"
import type { HTMLAttributes } from "react"
import { forwardRef } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const containerVariants = cva({
  base: "relative w-full max-w-[64rem] mx-auto px-6 lg:px-8",
})

type ContainerProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants> & {
    asChild?: boolean
  }

export const Container = forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
  const { className, asChild, ...rest } = props

  const Component = asChild ? Slot : "div"

  return <Component ref={ref} className={cx(containerVariants({ className }))} {...rest} />
})

Container.displayName = "Container"
