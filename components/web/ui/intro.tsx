import type { ComponentProps, ReactNode } from "react"
import { Heading, type HeadingProps } from "~/components/common/heading"
import { type VariantProps, cva, cx } from "~/utils/cva"

const introVariants = cva({
  base: "flex w-full flex-col gap-y-2",

  variants: {
    alignment: {
      start: "items-start text-start",
      center: "items-center text-center",
      end: "items-end text-end",
    },
  },

  defaultVariants: {
    alignment: "start",
  },
})

type IntroProps = Omit<ComponentProps<"div">, "title" | "prefix"> &
  VariantProps<typeof introVariants> & {
    title?: ReactNode
    description?: ReactNode
  }

const Intro = ({ children, className, alignment, title, description, ...props }: IntroProps) => {
  return (
    <div className={cx(introVariants({ alignment, className }))} {...props}>
      {title && <IntroTitle>{title}</IntroTitle>}
      {description && <IntroDescription>{description}</IntroDescription>}
      {children}
    </div>
  )
}

const IntroTitle = ({ size = "h1", ...props }: HeadingProps) => {
  return <Heading size={size} {...props} />
}

const IntroDescription = ({ className, ...props }: ComponentProps<"h2">) => {
  return <h2 className={cx("max-w-2xl text-secondary md:text-lg", className)} {...props} />
}

export { Intro, IntroTitle, IntroDescription }
