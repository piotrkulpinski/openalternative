"use client"

import { capitalCase } from "change-case"
import { useSearchParams } from "next/navigation"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { Button } from "~/components/web/ui/button"
import { config } from "~/config"
import { signIn } from "~/lib/auth-client"

type LoginButtonProps = ComponentProps<typeof Button> & {
  provider: "google" | "github"
}

export const LoginButton = ({ provider, ...props }: LoginButtonProps) => {
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get("callbackURL") || config.site.url

  const handleSignIn = () => {
    signIn.social({
      provider,
      callbackURL,
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  return (
    <Button size="lg" onClick={handleSignIn} {...props}>
      Sign in with {capitalCase(provider)}
    </Button>
  )
}
