import type { ComponentProps } from "react";
import { Stack } from "~/components/common/stack";
import { Favicon } from "~/components/web/ui/favicon";
import { NavLink } from "~/components/web/ui/nav-link";
import type { AlternativeMany } from "~/server/web/alternatives/payloads";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/common/hover-card";
import { Card, CardDescription, CardHeader } from "~/components/common/card";
import { H4 } from "~/components/common/heading";

type BrandLinkProps = ComponentProps<typeof NavLink> & {
  alternative: AlternativeMany;
};

export const BrandLink = ({
  children,
  alternative,
  ...props
}: BrandLinkProps) => {
  return (
    <HoverCard openDelay={250}>
      <HoverCardTrigger>
        <NavLink {...props}>
          <Favicon
            src={alternative.faviconUrl}
            title={alternative.name}
            className="size-6 p-[3px]"
          />

          <Stack size="xs">
            <strong className="font-medium">{alternative.name}</strong>
            {children && <span className="opacity-60">{children}</span>}
          </Stack>
        </NavLink>
      </HoverCardTrigger>
      <HoverCardContent asChild>
        <Card className="group/button w-80" hover={false}>
          <CardHeader>
            <Favicon src={alternative.faviconUrl} title={alternative.name} />

            <H4 as="h3" className="truncate flex-1">
              {alternative.name}
            </H4>
          </CardHeader>

          {alternative.description && (
            <CardDescription className="max-w-md line-clamp-4">
              {alternative.description}
            </CardDescription>
          )}
        </Card>
      </HoverCardContent>
    </HoverCard>
  );
};
