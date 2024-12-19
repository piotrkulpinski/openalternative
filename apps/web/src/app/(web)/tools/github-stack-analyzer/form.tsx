"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { posthog } from "posthog-js"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { analyzeStack } from "~/actions/stack-analyzer"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Stack } from "~/components/common/stack"
import { StackList } from "~/components/web/stacks/stack-list"
import { Button } from "~/components/web/ui/button"
import { Card } from "~/components/web/ui/card"
import { Input } from "~/components/web/ui/input"
import { type StackAnalyzerSchema, stackAnalyzerSchema } from "~/server/schemas"
import type { StackMany } from "~/server/web/stacks/payloads"

export function StackAnalyzerForm() {
  const [stack, setStack] = useState<StackMany[]>([])

  const form = useForm<StackAnalyzerSchema>({
    resolver: zodResolver(stackAnalyzerSchema),
    defaultValues: { repository: "" },
  })

  const { error, execute, isPending } = useServerAction(analyzeStack, {
    onSuccess: ({ data }) => {
      // Capture event
      posthog.capture("analyze_stack", form.getValues())

      // Reset form
      form.reset()

      // Show success toast
      toast.success("Stack analysis complete")

      // Show the results in a component below the form
      setStack(data)
    },
  })

  return (
    <>
      <Card hover={false} focus={false} className="w-full max-w-2xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(data => execute(data))}
            className="flex flex-col items-center w-full gap-5"
          >
            <FormField
              control={form.control}
              name="repository"
              render={({ field }) => (
                <FormItem className="self-stretch">
                  <Stack className="w-full justify-between">
                    <FormLabel>GitHub Repository URL:</FormLabel>
                    <Hint className="text-muted">*Must be a public GitHub repository.</Hint>
                  </Stack>

                  <FormControl>
                    <Stack size="sm" className="w-full">
                      <Input
                        size="lg"
                        placeholder="https://github.com/owner/name"
                        disabled={isPending}
                        className="flex-1"
                        data-1p-ignore
                        {...field}
                      />

                      <Button type="submit" size="lg" disabled={isPending}>
                        {isPending ? "Analyzing..." : "Analyze Repository"}
                      </Button>
                    </Stack>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <Hint className="col-span-full">{error.message}</Hint>}
          </form>
        </Form>
      </Card>

      {stack.length > 0 && <StackList stacks={stack} className="w-full max-w-2xl mx-auto" />}
    </>
  )
}
