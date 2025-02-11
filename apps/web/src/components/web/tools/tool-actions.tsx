"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ReportType } from "@openalternative/db/client"
import { BookmarkPlusIcon, EllipsisIcon, TriangleAlertIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import type { HTMLAttributes } from "react"
import { startTransition, useOptimistic, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/common/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/common/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { RadioGroup, RadioGroupItem } from "~/components/common/radio-group"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import { navLinkVariants } from "~/components/web/ui/nav-link"
import { siteConfig } from "~/config/site"
import { reportTool, toggleBookmark } from "~/server/web/tools/actions"
import type { ToolMany, ToolManyExtended } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

const reportSchema = z.object({
  type: z.nativeEnum(ReportType),
  message: z.string().optional(),
})

type ReportSchema = z.infer<typeof reportSchema>

type ToolActionsProps = HTMLAttributes<HTMLElement> & {
  tool: ToolMany | ToolManyExtended
  isBookmarked?: boolean
}

export const ToolActions = ({
  tool,
  isBookmarked = false,
  children,
  className,
  ...props
}: ToolActionsProps) => {
  const pathname = usePathname()
  const [bookmarked, setBookmarked] = useOptimistic(isBookmarked)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: ReportType.BrokenLink,
      message: "",
    },
  })

  const { execute, isPending } = useServerAction(reportTool, {
    onSuccess: () => {
      toast.success("Thank you for your report")
      setIsOpen(false)
      form.reset()
    },
    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleBookmark = async () => {
    startTransition(() => setBookmarked(!bookmarked))
    await toggleBookmark({ toolSlug: tool.slug, callbackURL: `${siteConfig.url}${pathname}` })
  }

  const handleClose = () => {
    form.reset()
    setIsOpen(false)
  }

  return (
    <TooltipProvider delayDuration={250}>
      <Stack size="sm" className={cx("flex-nowrap justify-end text-lg", className)} {...props}>
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" prefix={<EllipsisIcon className="-my-1 size-5!" />} />
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" align="end" className="min-w-36">
              <DropdownMenuItem asChild>
                <button type="button" className={navLinkVariants()} onClick={() => setIsOpen(true)}>
                  <TriangleAlertIcon className="shrink-0 size-4 opacity-75" />
                  Report
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report {tool.name}</DialogTitle>
              <DialogDescription>What is happening with this tool?</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => execute({ toolSlug: tool.slug, ...data }))}
                className="grid gap-6"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid gap-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={ReportType.BrokenLink} id="r1" />
                            <FormLabel htmlFor="r1">Broken link</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={ReportType.WrongCategory} id="r2" />
                            <FormLabel htmlFor="r2">Wrong category</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={ReportType.WrongAlternative} id="r3" />
                            <FormLabel htmlFor="r3">Wrong alternative</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={ReportType.Outdated} id="r4" />
                            <FormLabel htmlFor="r4">Outdated information</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={ReportType.Other} id="r5" />
                            <FormLabel htmlFor="r5">Other</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (optional)</FormLabel>
                      <FormControl>
                        <TextArea
                          placeholder="Provide additional details about the issue..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={handleClose}>
                    Cancel
                  </Button>

                  <Button variant="destructive" className="min-w-28" isPending={isPending}>
                    Report
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* <Tooltip tooltip={bookmarked ? "Remove bookmark" : "Add bookmark"}>
          <Button
            variant={bookmarked ? "fancy" : "secondary"}
            prefix={<BookmarkPlusIcon className="-my-1 size-5!" />}
            onClick={handleBookmark}
          />
        </Tooltip> */}

        {children}
      </Stack>
    </TooltipProvider>
  )
}
