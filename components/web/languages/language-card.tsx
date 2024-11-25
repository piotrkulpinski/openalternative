import Link from "next/link"
import plur from "plur"
import type { ComponentProps } from "react"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import {
  CardSimple,
  CardSimpleCaption,
  CardSimpleDivider,
  CardSimpleTitle,
} from "~/components/web/ui/card-simple"
import type { LanguageMany } from "~/server/languages/payloads"

type LanguageCardProps = ComponentProps<typeof CardSimple> & {
  language: LanguageMany
}

const LanguageCard = ({ language, ...props }: LanguageCardProps) => {
  return (
    <CardSimple asChild {...props}>
      <Link href={`/languages/${language.slug}`}>
        <Stack size="sm">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: language.color ?? undefined }}
          />
          <CardSimpleTitle>{language.name}</CardSimpleTitle>
        </Stack>

        <CardSimpleDivider />

        <CardSimpleCaption>
          {`${language._count.tools} ${plur("tool", language._count.tools)}`}
        </CardSimpleCaption>
      </Link>
    </CardSimple>
  )
}

const LanguageCardSkeleton = () => {
  return (
    <CardSimple>
      <CardSimpleTitle className="w-1/3">
        <Skeleton>&nbsp;</Skeleton>
      </CardSimpleTitle>

      <Skeleton className="h-0.5 flex-1" />

      <CardSimpleCaption className="w-1/4">
        <Skeleton>&nbsp;</Skeleton>
      </CardSimpleCaption>
    </CardSimple>
  )
}

export { LanguageCard, LanguageCardSkeleton }
