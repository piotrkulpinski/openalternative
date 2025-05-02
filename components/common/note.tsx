import type { ComponentProps, ElementType } from "react"
import { cx } from "~/utils/cva"

type NoteProps = ComponentProps<"p"> & {
  as?: ElementType
}

export const Note = ({ className, as, ...props }: NoteProps) => {
  const Comp = as || "p"

  return <Comp className={cx("text-sm text-muted-foreground", className)} {...props} />
}
