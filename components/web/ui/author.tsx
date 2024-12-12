import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"

type AuthorProps = ComponentProps<typeof Stack> & {
  name: string
  image: string
  twitterHandle?: string
  title?: string
}

export const Author = ({ name, image, twitterHandle, title, ...props }: AuthorProps) => {
  return (
    <Stack size="sm" {...props}>
      <img
        src={image}
        alt={`${name}'s profile`}
        width={48}
        height={48}
        className="size-12 rounded-full group-hover:brightness-90"
      />

      <div>
        <h3 className="font-medium text-base truncate">{name}</h3>
        {twitterHandle && <div className="text-muted text-sm/tight">@{twitterHandle}</div>}
        {title && <div className="text-muted text-sm/tight">{title}</div>}
      </div>
    </Stack>
  )
}
