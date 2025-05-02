"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "~/components/common/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/common/form"
import { Icon } from "~/components/common/icon"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { signIn } from "~/lib/auth-client"

type LoginFormProps = ComponentProps<"form"> & {}

export const LoginForm = ({ ...props }: LoginFormProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, setIsPending] = useState(false)
  const callbackURL = searchParams.get("next") || pathname

  const schema = z.object({
    email: z.string().email(),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const handleSignIn = ({ email }: z.infer<typeof schema>) => {
    signIn.magicLink({
      email,
      callbackURL,
      fetchOptions: {
        onResponse: () => {
          setIsPending(false)
        },
        onRequest: () => {
          setIsPending(true)
        },
        onSuccess: () => {
          router.push(`/auth/verify?email=${email}`)
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  return (
    <Form {...form}>
      <Stack direction="column" className="items-stretch" asChild>
        <form onSubmit={form.handleSubmit(handleSignIn)} noValidate {...props}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    size="lg"
                    placeholder="Enter your email"
                    data-1p-ignore
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button suffix={<Icon name="lucide/inbox" />} isPending={isPending}>
            Send me a Magic Link
          </Button>
        </form>
      </Stack>
    </Form>
  )
}
