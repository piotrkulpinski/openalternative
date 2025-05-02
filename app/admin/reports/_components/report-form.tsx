"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ReportType } from "@prisma/client"
import { sentenceCase } from "change-case"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { ReportActions } from "~/app/admin/reports/_components/report-actions"
import { Button } from "~/components/common/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { H3 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { TextArea } from "~/components/common/textarea"
import { updateReport } from "~/server/admin/reports/actions"
import type { findReportById } from "~/server/admin/reports/queries"
import { reportSchema } from "~/server/admin/reports/schema"
import { cx } from "~/utils/cva"

type ReportFormProps = ComponentProps<"form"> & {
  report: NonNullable<Awaited<ReturnType<typeof findReportById>>>
}

export function ReportForm({ children, className, title, report, ...props }: ReportFormProps) {
  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: report?.type ?? ReportType.Other,
      message: report?.message ?? "",
    },
  })

  // Update report
  const updateAction = useServerAction(updateReport, {
    onSuccess: () => {
      toast.success("Report successfully updated")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  const handleSubmit = form.handleSubmit(data => {
    updateAction.execute({ id: report.id, ...data })
  })

  return (
    <Form {...form}>
      <Stack className="justify-between">
        <H3 className="flex-1 truncate">{title}</H3>

        <Stack size="sm" className="-my-0.5">
          <ReportActions report={report} size="md" />
        </Stack>
      </Stack>

      <form
        onSubmit={handleSubmit}
        className={cx("grid gap-4 @sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ReportType).map(type => (
                    <SelectItem key={type} value={type}>
                      {sentenceCase(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <TextArea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-4 col-span-full">
          <Button size="md" variant="secondary" asChild>
            <Link href="/admin/reports">Cancel</Link>
          </Button>

          <Button size="md" isPending={updateAction.isPending}>
            Update report
          </Button>
        </div>
      </form>
    </Form>
  )
}
