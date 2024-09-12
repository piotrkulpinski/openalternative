import type { SerializeFrom } from "@remix-run/node"
import { useFetcher, useLocation } from "@remix-run/react"
import { ThumbsUpIcon } from "lucide-react"
import { type ComponentProps, useId } from "react"
import { Button } from "~/components/ui/button"
import { ErrorMessage } from "~/components/ui/forms/error-message"
import { Input } from "~/components/ui/forms/input"
import { TextArea } from "~/components/ui/forms/text-area"
import { Popover } from "~/components/ui/popover"
import type { action } from "~/routes/api.feedback"
import type { ToolOne } from "~/services.server/api"

type FeedbackButtonProps = Omit<ComponentProps<typeof Popover>, "popover"> & {
  tool: SerializeFrom<ToolOne>
}

export const FeedbackButton = ({ tool, ...props }: FeedbackButtonProps) => {
  const id = useId()
  const { key } = useLocation()
  const { data, state, Form } = useFetcher<typeof action>({ key: `${id}-${key}` })

  return (
    <Popover
      popover={
        <>
          {data?.type !== "success" && (
            <Form method="POST" action="/api/feedback" className="flex flex-col gap-1.5" noValidate>
              <input type="hidden" name="toolId" value={tool.id} />

              <Input
                type="email"
                name="email"
                placeholder="Your email"
                className="py-1.5 px-2.5 rounded w-full"
                data-1p-ignore
              />

              <ErrorMessage errors={data?.error.fieldErrors.email} />

              <TextArea
                name="feedback"
                rows={3}
                placeholder="Feedback"
                className="py-1.5 px-2.5 rounded w-full min-h-14"
              />

              <ErrorMessage errors={data?.error.fieldErrors.feedback} />

              <Button size="sm" variant="primary" className="py-1.5" isPending={state !== "idle"}>
                Send
              </Button>
            </Form>
          )}

          {data?.type === "error" && <ErrorMessage errors={data.error.formErrors} />}

          {data?.type === "success" && (
            <p className="text-xs text-green-600 text-center">{data.message}</p>
          )}
        </>
      }
      className="p-1.5 w-48"
      {...props}
    >
      <Button size="sm" variant="secondary" prefix={<ThumbsUpIcon />}>
        Send Feedback
      </Button>
    </Popover>
  )
}
