import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const containerVariants = cva({
  base: "relative w-full max-w-[64rem] mx-auto px-6 lg:px-8",
})

type ContainerProps = ComponentProps<"div"> &
  VariantProps<typeof containerVariants> & {
    asChild?: boolean
  }

const Container = ({ className, asChild, ...props }: ContainerProps) => {
  const Comp = asChild ? Slot.Root : "div"

  return <Comp className={cx(containerVariants({ className }))} {...props} />
}

export { Container, containerVariants }
