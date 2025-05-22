import type { ComponentProps } from "react"
import { Card } from "~/components/common/card"
import { Markdown } from "~/components/web/markdown"
import { Author } from "~/components/web/ui/author"
import type { config } from "~/config"
import { cx } from "~/utils/cva"

type TestimonialProps = ComponentProps<typeof Card> & (typeof config.ads.testimonials)[number]

export const Testimonial = ({ quote, author, className, ...props }: TestimonialProps) => {
  return (
    <Card
      hover={false}
      className={cx("items-center max-w-3xl mx-auto", className)}
      {...props}
      asChild
    >
      <blockquote>
        <Markdown className="text-center text-lg/relaxed" code={quote} />

        <Author {...author} />
      </blockquote>
    </Card>
  )
}
