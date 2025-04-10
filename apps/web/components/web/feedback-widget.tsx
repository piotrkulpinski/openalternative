"use client"

import { getRandomDigits } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocalStorage } from "@mantine/hooks"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { reportFeedback } from "~/actions/report"
import { Button } from "~/components/common/button"
import { Form, FormControl, FormField, FormItem } from "~/components/common/form"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { siteConfig } from "~/config/site"
import { type FeedbackSchema, feedbackSchema } from "~/server/web/shared/schemas"

type FeedbackWidgetFormProps = {
  toastId: string
  setDismissed: (dismissed: boolean) => void
}

const FeedbackWidgetForm = ({ toastId, setDismissed }: FeedbackWidgetFormProps) => {
  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { message: "" },
  })

  const { execute, isPending } = useServerAction(reportFeedback, {
    onSuccess: () => {
      toast("Thank you for your feedback!", {
        id: toastId,
        duration: 3000,
      })

      setDismissed(true)
      form.reset()
    },

    onError: ({ err }) => {
      toast.error(err.message, {
        id: toastId,
        duration: 3000,
      })
    },
  })

  return (
    <Form {...form}>
      <Stack direction="column" className="items-stretch w-full" asChild>
        <form onSubmit={form.handleSubmit(execute)} noValidate>
          <p className="text-xs">What can we do to improve {siteConfig.name}?</p>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextArea
                    placeholder="Your feedback here..."
                    className="h-20 text-xs"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Stack size="sm">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="text-xs flex-1"
              onClick={() => toast.dismiss()}
            >
              Dismiss
            </Button>

            <Button size="sm" className="text-xs flex-1" isPending={isPending}>
              Send feedback
            </Button>
          </Stack>
        </form>
      </Stack>
    </Form>
  )
}

export const FeedbackWidget = () => {
  const toastId = useMemo(() => getRandomDigits(10), [])

  const [dismissed, setDismissed] = useLocalStorage({
    key: "feedback-widget-dismissed",
    defaultValue: false,
    getInitialValueInEffect: false,
  })

  useEffect(() => {
    if (!dismissed) {
      setTimeout(() => {
        toast(<FeedbackWidgetForm toastId={toastId} setDismissed={setDismissed} />, {
          id: toastId,
          duration: Number.POSITIVE_INFINITY,
          className: "max-w-54 py-3",
          onDismiss: () => setDismissed(true),
        })
      }, 0)
    }
  }, [dismissed])

  return null
}
