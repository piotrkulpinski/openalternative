import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "apps/web/app/components/DropdownMenu"
import { Tooltip } from "apps/web/app/components/Tooltip"
import type { HTMLAttributes } from "react"

export const ThemeSwitcher = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  const { resolvedTheme, setTheme } = useTheme()
  const Icon = resolvedTheme === "dark" ? MoonIcon : SunIcon

  return (
    <DropdownMenu modal={false}>
      <Tooltip tooltip="Toggle Theme">
        <DropdownMenuTrigger>
          <Icon className="size-[1.44em] stroke-[1.25] text-muted hover:text-foreground" />
        </DropdownMenuTrigger>
      </Tooltip>

      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme("light")} asChild>
          <button type="button">Light</button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} asChild>
          <button type="button">Dark</button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} asChild>
          <button type="button">System</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
