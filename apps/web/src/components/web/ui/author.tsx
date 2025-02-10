import Image from "next/image"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"

type AuthorProps = ComponentProps<typeof Stack> & {
  name: string
  image: string
  title?: string
}

export const Author = ({ name, image, title, ...props }: AuthorProps) => {
  return (
    <Stack size="sm" {...props}>
      <Image
        src={image}
        alt={`${name}'s profile`}
        width={48}
        height={48}
        className="size-12 rounded-full group-hover:brightness-90"
      />

      <div>
        <h3 className="font-medium text-base truncate">{name}</h3>
        {title && <div className="text-muted-foreground text-sm/tight">{title}</div>}
      </div>
    </Stack>
  )
}
