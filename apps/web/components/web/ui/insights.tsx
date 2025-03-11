import { Slot } from "radix-ui"
import { type ComponentProps, Fragment, type ReactNode, isValidElement } from "react"
import { Link } from "~/components/common/link"
import { cx } from "~/utils/cva"

type InsightsProps = ComponentProps<"ul"> & {
  insights: {
    label: string
    value: ReactNode
    link?: string
    title?: string
    icon?: ReactNode
  }[]
}

export const Insights = ({ className, insights, ...props }: InsightsProps) => {
  return (
    <ul className={cx("w-full text-xs", className)} {...props}>
      {insights.map(({ label, value, link, title, icon }) => {
        const valueComp = isValidElement(value) ? value : <span>{value}</span>

        return (
          <Fragment key={label}>
            <li className="flex items-center gap-3 py-1">
              <p className="flex items-center min-w-0 gap-1.5 text-secondary-foreground">
                <Slot.Root className="size-[1.1em] shrink-0 opacity-75">{icon}</Slot.Root>
                <span className="flex-1 truncate">{label}</span>
              </p>

              <hr className="min-w-2 flex-1" />

              {link ? (
                <Link
                  href={link}
                  className="shrink-0 font-medium decoration-border underline hover:decoration-foreground"
                  title={title}
                >
                  {value}
                </Link>
              ) : (
                <Slot.Root className="shrink-0 font-medium" title={title}>
                  {valueComp}
                </Slot.Root>
              )}
            </li>
          </Fragment>
        )
      })}
    </ul>
  )
}
