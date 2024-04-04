import { Fragment, HTMLAttributes, ReactNode } from "react"
import { cx } from "~/utils/cva"

type InsightsProps = HTMLAttributes<HTMLElement> & {
  insights: {
    label: string
    value: ReactNode | null
    title?: string
    icon: React.ComponentType<{ className?: string }>
  }[]
}

export const Insights = ({ className, insights, ...props }: InsightsProps) => {
  return (
    <ul className={cx("w-full text-xs", className)} {...props}>
      {insights.map(({ label, value, title, icon: Icon }) => (
        <Fragment key={label}>
          {value !== null && (
            <li className="flex min-w-0 items-center gap-3 py-1">
              <p className="flex items-center gap-1.5 truncate text-neutral-600 dark:text-neutral-400">
                <Icon className="size-[1.1em] shrink-0 opacity-75" /> {label}
              </p>

              <span className="h-px grow bg-current opacity-15" />
              <span className="shrink-0 font-medium" title={title}>
                {value}
              </span>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  )
}
