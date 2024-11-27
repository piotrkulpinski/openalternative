import type { ComponentProps } from "react"
import { H3 } from "~/components/common/heading"
import { cx } from "~/utils/cva"

const Card = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx("rounded-lg border bg-card text-card-foreground shadow-xs", className)}
      {...props}
    />
  )
}

const CardHeader = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("flex flex-col space-y-1.5 p-4 md:p-6", className)} {...props} />
}

const CardTitle = ({ ...props }: ComponentProps<"h3">) => {
  return <H3 {...props} />
}

const CardDescription = ({ className, ...props }: ComponentProps<"p">) => {
  return <p className={cx("text-sm text-muted-foreground", className)} {...props} />
}

const CardContent = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("p-4 pt-0 md:p-6 md:pt-0", className)} {...props} />
}

const CardFooter = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("flex items-center p-4 pt-0 md:p-6 md:pt-0", className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
