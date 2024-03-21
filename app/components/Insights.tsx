import { Fragment, HTMLAttributes, ReactNode } from "react"
import { cx } from "~/utils/cva"

type InsightsProps = HTMLAttributes<HTMLElement> & {
  insights: {
    label: string
    value: ReactNode | null
    icon: React.ComponentType<{ className?: string }>
  }[]
}

export const Insights = ({ className, insights, ...props }: InsightsProps) => {
  return (
    <ul className={cx("w-full text-xs", className)} {...props}>
      {insights.map(({ label, value, icon: Icon }) => (
        <Fragment key={label}>
          {value !== null && value !== undefined && (
            <li className="flex min-w-0 items-center gap-3 py-1">
              <p className="flex shrink-0 items-center gap-1.5 text-neutral-500">
                <Icon className="size-[1.1em] opacity-75 max-sm:hidden" /> {label}
              </p>

              <span className="h-px flex-1 bg-current opacity-15" />
              <span className="shrink-0 font-medium">{value.toLocaleString()}</span>
            </li>
          )}
        </Fragment>
      ))}
    </ul>
  )
}
