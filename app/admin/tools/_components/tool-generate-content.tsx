import { experimental_useObject as useObject } from "@ai-sdk/react"
import { isValidUrl } from "@primoui/utils"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { contentSchema } from "~/server/admin/shared/schema"
import type { ToolSchema } from "~/server/admin/tools/schema"

export const ToolGenerateContent = () => {
  const { watch, setValue } = useFormContext<ToolSchema>()

  const [url] = watch(["websiteUrl"])
  const errorMessage = "Something went wrong. Please check the console for more details."
  const successMessage = "Content generated successfully. Please save the tool to update."

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/ai/generate-content",
    schema: contentSchema,

    onFinish: ({ error }) => {
      error ? toast.error(errorMessage) : toast.success(successMessage)
    },

    onError: () => {
      toast.error(errorMessage)
    },
  })

  // Handle streaming updates from AI SDK
  useEffect(() => {
    if (object) {
      setValue("tagline", object.tagline)
      setValue("description", object.description)
      setValue("content", object.content)
    }
  }, [object])

  const handleGenerateContent = () => {
    if (isValidUrl(url)) {
      submit({ url })
    } else {
      toast.error("Invalid URL. Please enter a valid URL.")
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      prefix={
        isLoading ? (
          <Icon name="lucide/loader" className="animate-spin" />
        ) : (
          <Icon name="lucide/sparkles" />
        )
      }
      disabled={!isValidUrl(url)}
      onClick={() => (isLoading ? stop() : handleGenerateContent())}
    >
      {isLoading ? "Stop Generating" : "Generate Content"}
    </Button>
  )
}
