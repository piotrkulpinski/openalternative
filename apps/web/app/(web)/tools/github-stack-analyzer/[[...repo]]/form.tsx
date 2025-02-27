"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { analyzeStack } from "~/actions/stack-analyzer"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { Section, SectionContent } from "~/components/web/ui/section"
import { type StackAnalyzerSchema, stackAnalyzerSchema } from "~/server/schemas"

export function StackAnalyzerForm() {
  const router = useRouter()
  // const [analysis, setAnalysis] = useState<{
  //   stacks: StackMany[]
  //   tool: ToolOne | null
  //   repository: RepositoryData
  // }>()

  const form = useForm<StackAnalyzerSchema>({
    resolver: zodResolver(stackAnalyzerSchema),
    defaultValues: { repository: "" },
  })

  const { error, execute, isPending } = useServerAction(analyzeStack, {
    onSuccess: ({ data }) => {
      // Capture event
      posthog.capture("analyze_stack", { repository: data })

      // Show success toast
      toast.success("Stack analysis complete")

      // Show the results in a component below the form
      router.push(`/tools/github-stack-analyzer/${data}`)

      // Reset form
      form.reset()
    },
  })

  return (
    <>
      <Section>
        <SectionContent>
          <Card hover={false} focus={false}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => execute(data))}
                className="flex flex-col w-full gap-5"
              >
                <FormField
                  control={form.control}
                  name="repository"
                  render={({ field }) => (
                    <FormItem>
                      <Stack className="w-full justify-between">
                        <FormLabel>GitHub Repository URL*:</FormLabel>
                        <Hint className="text-muted-foreground/50">
                          *Must be a public GitHub repository.
                        </Hint>
                      </Stack>

                      <FormControl>
                        <Stack size="sm" className="w-full">
                          <Input
                            size="lg"
                            placeholder="https://github.com/owner/name"
                            disabled={isPending}
                            className="flex-1"
                            {...field}
                          />

                          <Button type="submit" size="lg" isPending={isPending}>
                            {isPending ? "Analyzing..." : "Analyze Repository"}
                          </Button>
                        </Stack>
                      </FormControl>
                      <FormMessage />

                      {error && <Hint className="mt-1">{error.message}</Hint>}
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </Card>
        </SectionContent>
      </Section>

      {/* <StackAnalysis analysis={analysis} /> */}
    </>
  )
}
