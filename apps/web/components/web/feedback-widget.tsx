"use client"

import { getRandomDigits } from "@curiousleaf/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocalStorage } from "@mantine/hooks"
import debounce from "debounce"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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

const ENGAGEMENT_THRESHOLD = 60 // seconds
const PAGE_VIEW_THRESHOLD = 3 // number of pages
const SCROLL_THRESHOLD = 66 // percentage
const TIME_CHECK_INTERVAL = 5 // seconds - how often to check engagement
const SCROLL_DEBOUNCE = 150 // ms - how often to check scroll position

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
              onClick={() => {
                toast.dismiss()
                setDismissed(true)
              }}
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
  const startTime = useRef(Date.now())
  const [shouldShow, setShouldShow] = useState(false)
  const maxScrollRef = useRef(0)
  const feedbackKey = "oa-feedback-dismissed"
  const pageViewsKey = "oa-page-views"

  const [dismissed, setDismissed] = useLocalStorage({
    key: feedbackKey,
    defaultValue: false,
    getInitialValueInEffect: false,
  })

  // Initialize page views once
  const pageViews = useMemo(() => {
    if (typeof sessionStorage === "undefined") {
      return 1
    }

    const storedViews = Number.parseInt(sessionStorage.getItem(pageViewsKey) || "1")
    sessionStorage.setItem(pageViewsKey, (storedViews + 1).toString())
    return storedViews + 1
  }, [])

  // Debounced scroll handler
  const handleScroll = useMemo(
    () =>
      debounce(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrolled = (window.scrollY / scrollHeight) * 100
        maxScrollRef.current = Math.max(maxScrollRef.current, scrolled)
      }, SCROLL_DEBOUNCE),
    [],
  )

  // Check engagement criteria
  const checkEngagement = useCallback(() => {
    if (dismissed || shouldShow) return

    const timeSpent = (Date.now() - startTime.current) / 1000

    if (
      timeSpent >= ENGAGEMENT_THRESHOLD &&
      pageViews >= PAGE_VIEW_THRESHOLD &&
      maxScrollRef.current >= SCROLL_THRESHOLD
    ) {
      setShouldShow(true)

      toast(<FeedbackWidgetForm toastId={toastId} setDismissed={setDismissed} />, {
        id: toastId,
        duration: Number.POSITIVE_INFINITY,
        className: "max-w-54 py-3",
        onDismiss: () => setDismissed(true),
      })
    }
  }, [dismissed, shouldShow, pageViews, toastId, setDismissed])

  // Setup scroll listener and engagement checker
  useEffect(() => {
    if (dismissed) return

    window.addEventListener("scroll", handleScroll)
    const interval = setInterval(checkEngagement, TIME_CHECK_INTERVAL * 1000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      handleScroll.clear() // Using clear() instead of cancel() for debounce
      clearInterval(interval)
    }
  }, [dismissed, handleScroll, checkEngagement])

  return null
}
