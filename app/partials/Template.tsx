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
      className={cx("group/button rounded-lg gap-y-8 md:flex-row md:items-center", className)}
      asChild
      {...props}
    >
      <Link
        to={FRAMER_TEMPLATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => posthog.capture("template_clicked")}
      >
        <div className="flex flex-col items-start flex-1 gap-4 max-w-96 md:p-4">
          <H2 className="text-pretty max-w-80">Clone this website in Framer</H2>

          <p className="text-muted mb-2">
            Clone this design in Framer and start building your own directory website. The template
            includes animations, interactions, and code components. No design or code skills
            required.
          </p>

          <Button size="lg" className="mt-auto pointer-events-none">
            Get Framer Template
          </Button>
        </div>

        <img
          src="/aperto.avif"
          alt=""
          className="w-full h-auto flex-1 rounded-md md:w-1/2 lg:w-2/3 lg:max-w-lg"
        />
      </Link>
    </Card>
  )
}
