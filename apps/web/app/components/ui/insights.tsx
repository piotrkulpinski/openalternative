import { Link } from "@remix-run/react"
import { Fragment, type HTMLAttributes, type ReactNode } from "react"
import { cx } from "~/utils/cva"

type InsightsProps = HTMLAttributes<HTMLElement> & {
  insights: {
    label: string
    value: ReactNode
    link?: string
    title?: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

export const Insights = ({ className, insights, ...props }: InsightsProps) => {
  return (
    <ul className={cx("w-full text-xs", className)} {...props}>
      {insights.map(({ label, value, link, title, icon: Icon }) => (
        <Fragment key={label}>
          <li className="flex items-center gap-3 py-1">
            <p className="flex items-center min-w-0 gap-1.5 text-secondary">
              <Icon className="size-[1.1em] shrink-0 opacity-75" />
              <span className="flex-1 truncate">{label}</span>
            </p>

            <hr className="min-w-2 flex-1" />

            {link ? (
              <Link
                to={link}
                className="shrink-0 font-medium hover:underline"
                title={title}
                unstable_viewTransition
              >
                {value}
              </Link>
            ) : (
              <span className="shrink-0 font-medium" title={title}>
                {value}
              </span>
            )}
          </li>
        </Fragment>
      ))}
    </ul>
  )
}
