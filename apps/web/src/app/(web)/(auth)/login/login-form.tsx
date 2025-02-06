"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { InboxIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { type ComponentProps, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/components/common/form"
import { Button } from "~/components/web/ui/button"
import { Input } from "~/components/web/ui/input"
import { signIn } from "~/lib/auth-client"
import { cx } from "~/utils/cva"

type LoginFormProps = ComponentProps<"form"> & {}

export const LoginForm = ({ className, ...props }: LoginFormProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, setIsPending] = useState(false)
  const callbackURL = searchParams.get("callbackURL") || undefined

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
          router.push(`/verify?email=${email}`)
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignIn)}
        className={cx("flex flex-col gap-4", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="email" size="lg" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="fancy" className="w-full" suffix={<InboxIcon />} isPending={isPending}>
          Send me a Magic Link
        </Button>
      </form>
    </Form>
  )
}
