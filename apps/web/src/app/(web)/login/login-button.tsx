"use client"

import { capitalCase } from "change-case"
import type { ComponentProps } from "react"
import { toast } from "sonner"
import { Button } from "~/components/web/ui/button"
import { config } from "~/config"
import { signIn } from "~/lib/auth-client"

type LoginButtonProps = ComponentProps<typeof Button> & {
  provider: "google"
  callbackURL?: string
}

export const LoginButton = ({ provider, callbackURL, ...props }: LoginButtonProps) => {
  callbackURL ||= `${config.site.url}/admin`

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
      Continue with {capitalCase(provider)}
    </Button>
  )
}
