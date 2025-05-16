import { experimental_useObject as useObject } from "@ai-sdk/react"
import { isValidUrl } from "@curiousleaf/utils"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import type { AlternativeSchema } from "~/server/admin/alternatives/schema"
import { descriptionSchema } from "~/server/admin/shared/schema"

export const AlternativeGenerateDescription = () => {
  const errorMessage = "Something went wrong. Please check the console for more details."
  const successMessage =
    "Description generated successfully. Please save the alternative to update."

  const { watch, setValue } = useFormContext<AlternativeSchema>()
  const [url] = watch(["websiteUrl"])

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/ai/generate-description",
    schema: descriptionSchema,

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
      setValue("description", object.description)
    }
  }, [object])

  const handleGenerateDescription = () => {
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
      onClick={() => (isLoading ? stop() : handleGenerateDescription())}
    >
      {isLoading ? "Stop Generating" : "Generate Description"}
    </Button>
  )
}
