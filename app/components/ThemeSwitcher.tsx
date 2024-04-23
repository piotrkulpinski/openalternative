import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/DropdownMenu"
import { Button } from "~/components/Button"
import { HTMLAttributes } from "react"

export const ThemeSwitcher = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          title="Toggle theme"
          prefix={resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
          {...props}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} asChild>
          <button>Light</button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} asChild>
          <button>Dark</button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} asChild>
          <button>System</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
