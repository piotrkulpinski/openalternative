import { MDXContent } from "@content-collections/mdx/react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { Prose } from "~/components/common/prose"
import { cx } from "~/utils/cva"

const components = {
  a: (props: ComponentProps<"a">) => {
    const href = props.href

    if (href?.startsWith("/")) {
      return <Link {...props} href={href} />
    }

    if (href?.startsWith("#")) {
      return <a {...props} />
    }

    return <a {...props} target="_blank" rel="noopener noreferrer nofollow" />
  },

  img: ({ className, ...props }: ComponentProps<"img">) => (
    <img className={cx("w-full rounded-lg", className)} {...props} />
  ),

  Image: ({ className, ...props }: ComponentProps<"img">) => (
    <img className={cx("w-full rounded-lg", className)} {...props} />
  ),
}

type ArticleProps = ComponentProps<typeof Prose> & {
  content: string
}

export const Article = ({ className, content, ...props }: ArticleProps) => {
  return (
    <Prose className={cx("!max-w-3xl", className)} {...props}>
      <MDXContent code={content} components={components} />
    </Prose>
  )
}
