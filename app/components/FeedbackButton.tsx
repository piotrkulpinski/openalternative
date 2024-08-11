import type { SerializeFrom } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { ThumbsUpIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Button } from "~/components/Button"
import { Popover } from "~/components/Popover"
import { Input } from "~/components/forms/Input"
import { TextArea } from "~/components/forms/TextArea"
import type { ToolOne } from "~/services.server/api"

type FeedbackButtonProps = Omit<ComponentProps<typeof Popover>, "popover"> & {
  tool: SerializeFrom<ToolOne>
}

export const FeedbackButton = ({ tool, ...props }: FeedbackButtonProps) => {
  return (
    <Popover
      popover={
        <div className="flex flex-col gap-1.5">
          <Form className="flex flex-col gap-1.5">
            <Input
              type="email"
              name="email"
              placeholder="Your email"
              className="py-1.5 rounded w-full"
              data-1p-ignore
              required
            />
            <TextArea
              name="feedback"
              rows={3}
              placeholder="Feedback"
              className="py-1.5 rounded w-full min-h-14"
              required
            />
          </Form>

          <Button size="sm" variant="primary" className="py-1.5">
            Send
          </Button>
        </div>
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
