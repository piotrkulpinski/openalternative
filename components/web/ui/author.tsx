import Link from "next/link"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { cx } from "~/utils/cva"

type AuthorProps = ComponentProps<typeof Stack> & {
  name: string
  image: string
  twitterHandle: string
}

export const Author = ({ className, name, image, twitterHandle, ...props }: AuthorProps) => {
  return (
    <Stack size="sm" className={cx("group", className)} asChild {...props}>
      <Link
        href={`https://x.com/${twitterHandle}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        <img
          src={image}
          alt={`${name}'s profile`}
          width={48}
          height={48}
          className="size-12 rounded-full group-hover:brightness-90"
        />

        <div>
          <h3 className="font-medium text-base truncate">{name}</h3>
          <div className="text-muted text-sm/tight">@{twitterHandle}</div>
        </div>
      </Link>
    </Stack>
  )
}
