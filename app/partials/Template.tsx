import { Link } from "@remix-run/react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Button } from "~/components/Button"
import { Card } from "~/components/Card"
import { H2 } from "~/components/Heading"
import { FRAMER_TEMPLATE_URL } from "~/utils/constants"
import { cx } from "~/utils/cva"

export const Template = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <Card
      className={cx("group/button rounded-lg md:flex-row md:items-stretch", className)}
      asChild
      {...props}
    >
      <Link to={FRAMER_TEMPLATE_URL} onClick={() => posthog.capture("template_clicked")}>
        <div className="flex flex-col items-start flex-1 gap-4 lg:p-4">
          <H2>Get this design as a Framer template</H2>

          <p className="text-muted">
            Clone this design in Framer and start building your own directory website. The template
            includes animations, interactions, and code components. No design or code skills
            required.
          </p>

          <Button size="lg" variant="fancy" className="mt-auto pointer-events-none">
            Get the Aperto template
          </Button>
        </div>

        <img src="/aperto.png" alt="" className="w-full h-auto flex-1 rounded-md md:w-1/2" />
      </Link>
    </Card>
  )
}
