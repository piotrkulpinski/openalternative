import { StickerIcon } from "lucide-react"
import { posthog } from "posthog-js"
import { Button } from "~/components/Button"

interface FeedbackButtonProps {
  toolId: string
  toolName: string
}

export const FeedbackButton = ({ toolId, toolName }: FeedbackButtonProps) => {
  const handleFeedback = () => {
    // Implement your feedback logic here
    // For example, open a modal or redirect to a feedback form
    posthog.capture("feedback_button_clicked", { toolId, toolName })
    alert("Feedback functionality to be implemented")
  }

  return (
    <Button size="sm" variant="secondary" onClick={handleFeedback} prefix={<StickerIcon />}>
      Send Feedback
    </Button>
  )
}
