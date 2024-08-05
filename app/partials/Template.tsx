import { Link } from "@remix-run/react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Button } from "~/components/Button"
import { Card } from "~/components/Card"
import { H2 } from "~/components/Heading"
import { FRAMER_TEMPLATE_URL } from "~/utils/constants"
import { cx } from "~/utils/cva"

export const Template = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const copy =
    posthog.getFeatureFlag("template-link-conversion") === "clone"
      ? {
          title: "Clone this website in Framer",
          description:
            "Clone this design in Framer and start building your own directory website. The template includes animations, interactions, and code components. No design or code skills required.",
          label: "Get Framer Template",
        }
      : {
          title: "Get this design as a Framer template",
          description:
            "Grab this design as a Framer template and start building your own directory website. The template includes animations, interactions, and code components. No design or code skills required.",
          label: "Get the Aperto Template",
        }

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
          <H2 className="text-pretty max-w-80">{copy.title}</H2>
          <p className="text-muted mb-2">{copy.description}</p>

          <Button size="lg" className="mt-auto pointer-events-none">
            {copy.label}
          </Button>
        </div>

        <img
          src="/aperto.png"
          alt=""
          className="w-full h-auto flex-1 rounded-md md:w-1/2 lg:w-2/3 lg:max-w-lg"
        />
      </Link>
    </Card>
  )
}
