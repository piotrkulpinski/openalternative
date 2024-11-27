import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

const Table = ({ className, ...props }: ComponentProps<"table">) => {
  return (
    <div className="relative w-full overflow-auto">
      <table className={cx("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
}

const TableHeader = ({ className, ...props }: ComponentProps<"thead">) => {
  return <thead className={cx("[&_tr]:border-b", className)} {...props} />
}

const TableBody = ({ className, ...props }: ComponentProps<"tbody">) => {
  return <tbody className={cx("[&_tr:last-child]:border-0", className)} {...props} />
}

const TableFooter = ({ className, ...props }: ComponentProps<"tfoot">) => {
  return (
    <tfoot
      className={cx("border-t bg-muted font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
}

const TableRow = ({ className, ...props }: ComponentProps<"tr">) => {
  return (
    <tr
      className={cx(
        "group/row border-b [tbody>&]:hover:bg-muted data-[state=selected]:bg-accent",
        className,
      )}
      {...props}
    />
  )
}

const TableHead = ({ className, ...props }: ComponentProps<"th">) => {
  return (
    <th
      className={cx(
        "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  )
}

const TableCell = ({ className, ...props }: ComponentProps<"td">) => {
  return (
    <td
      className={cx("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
}

const TableCaption = ({ className, ...props }: ComponentProps<"caption">) => {
  return <caption className={cx("mt-4 text-sm text-muted-foreground", className)} {...props} />
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
