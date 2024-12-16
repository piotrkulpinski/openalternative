import { MDXContent } from "@content-collections/mdx/react"
import type { ComponentProps } from "react"
import { MDXComponents } from "~/components/web/mdx-components"
import { Prose } from "~/components/web/ui/prose"
import { cx } from "~/utils/cva"

type MDXProps = ComponentProps<typeof Prose> & ComponentProps<typeof MDXContent>

export const MDX = ({ className, code, components }: MDXProps) => {
  return (
    <Prose className={cx("max-w-3xl!", className)}>
      <MDXContent code={code} components={{ ...MDXComponents, ...components }} />
    </Prose>
  )
}
