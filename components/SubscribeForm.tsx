"use client"

import { Series, Affix, Button, Input, Alert } from "@curiousleaf/design"
import { MailIcon } from "lucide-react"
import { useState } from "react"
import { subscribe } from "~/actions/subscribe"

export const SubscribeForm = () => {
  const [success, setSuccess] = useState(false)

  const handleSubscribe = async (formData: FormData) => {
    await subscribe(formData)
    setSuccess(true)
  }

  if (success) {
    return (
      <Alert theme="success" className="py-2 ring-1 ring-current">
        Thank you for subscribing!
      </Alert>
    )
  }
  return (
    <Series size="sm" asChild>
      <form action={handleSubscribe}>
        <Affix prefix={<MailIcon className="size-4" />} className="w-auto">
          <Input type="email" name="email" placeholder="Get weekly newsletter" required />
        </Affix>

        <Button type="submit" theme="secondary">
          Subscribe
        </Button>
      </form>
    </Series>
  )
}
