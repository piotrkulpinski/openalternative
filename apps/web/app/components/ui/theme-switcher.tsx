import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import type { HTMLAttributes } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Tooltip } from "~/components/ui/tooltip"

export const ThemeSwitcher = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  const { resolvedTheme, setTheme } = useTheme()
  const Icon = resolvedTheme === "dark" ? MoonIcon : SunIcon

  return (
    <DropdownMenu modal={false}>
      <Tooltip tooltip="Toggle Theme">
        <DropdownMenuTrigger aria-label="Toggle Theme" {...props}>
          <Icon className="size-[1.44em] stroke-[1.25] text-muted hover:text-foreground" />
        </DropdownMenuTrigger>
      </Tooltip>

      <DropdownMenuContent align="start" side="top">
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
