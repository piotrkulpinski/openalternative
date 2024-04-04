import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/DropdownMenu"
import { Button } from "~/components/Button"
import { HTMLAttributes, ReactNode } from "react"

export const ThemeSwitcher = ({ ...props }: HTMLAttributes<HTMLElement>) => {
  const { theme, setTheme } = useTheme()

  let icon: ReactNode

  switch (theme) {
    case "light":
      icon = <SunIcon />
      break
    case "dark":
      icon = <MoonIcon />
      break
    default:
      icon = <MonitorIcon />
      break
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="secondary" title="Toggle theme" prefix={icon} {...props} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
