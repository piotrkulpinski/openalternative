import { Link } from "@remix-run/react"
import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

type AuthorProps = Omit<ComponentProps<typeof Link>, "to"> & {
  name: string
  image: string
  twitterHandle: string
}

export const Author = ({ className, name, image, twitterHandle, ...props }: AuthorProps) => {
  return (
    <Link
      to={`https://x.com/${twitterHandle}`}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cx("group flex items-center gap-2.5", className)}
      {...props}
    >
      <img
        src={image}
        alt={`${name}'s profile`}
        width={48}
        height={48}
        className="size-10 rounded-full group-hover:brightness-90"
      />

      <div>
        <h3 className="font-medium text-base truncate">{name}</h3>
        <div className="text-muted text-sm/tight">@{twitterHandle}</div>
      </div>
    </Link>
  )
}
