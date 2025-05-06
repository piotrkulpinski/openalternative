import { formatDateTime, isTruthy } from "@curiousleaf/utils"
import { ToolStatus } from "@prisma/client"
import { addDays, formatDate, isFriday, isMonday, isWednesday } from "date-fns"
import { type ComponentProps, type ReactNode, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button, type ButtonProps } from "~/components/common/button"
import { Calendar } from "~/components/common/calendar"
import { Checkbox } from "~/components/common/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/common/dialog"
import { FormControl, FormField, FormLabel } from "~/components/common/form"
import { FormItem } from "~/components/common/form"
import { H5, H6 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Input } from "~/components/common/input"
import { Note } from "~/components/common/note"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { RadioGroup, RadioGroupItem } from "~/components/common/radio-group"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { siteConfig } from "~/config/site"
import type { findToolBySlug } from "~/server/admin/tools/queries"
import type { ToolSchema } from "~/server/admin/tools/schema"
import { cx } from "~/utils/cva"

type ToolPublishActionsProps = ComponentProps<typeof Stack> & {
  tool?: NonNullable<Awaited<ReturnType<typeof findToolBySlug>>>
  isPending: boolean
  isStatusPending: boolean
  onStatusSubmit: (status: ToolStatus, publishedAt: Date | null) => void
}

type PopoverOption = {
  status: ToolStatus
  title: ReactNode
  description?: ReactNode
  button?: ButtonProps
}

type ActionConfig = Omit<ButtonProps, "popover"> & {
  popover?: {
    title: ReactNode
    description?: ReactNode
    options: PopoverOption[]
  }
}

export const ToolPublishActions = ({
  tool,
  isPending,
  isStatusPending,
  onStatusSubmit,
  children,
  ...props
}: ToolPublishActionsProps) => {
  const { control, watch } = useFormContext<ToolSchema>()
  const formValues = watch(["slug", "status", "submitterEmail", "publishedAt"])
  const [slug, status, submitterEmail, publishedAt] = formValues
  const publishedAtDate = new Date(publishedAt ?? new Date())

  const [isOpen, setIsOpen] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(status)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(formatDate(publishedAtDate, "yyyy-MM-dd"))
  const [selectedTime, setSelectedTime] = useState(formatDate(publishedAtDate, "HH:mm"))

  const handlePublished = () => {
    onStatusSubmit(ToolStatus.Published, new Date())
    setIsOpen(false)
  }

  const handleScheduled = () => {
    const scheduledDate = new Date(`${selectedDate}T${selectedTime}`)
    onStatusSubmit(ToolStatus.Scheduled, scheduledDate)
    setIsOpen(false)
  }

  const handleDraft = () => {
    onStatusSubmit(ToolStatus.Draft, null)
    setIsOpen(false)
  }

  const toolActions: Record<ToolStatus, ActionConfig[]> = {
    [ToolStatus.Draft]: [
      {
        type: "button",
        children: "Publish",
        variant: "fancy",
        popover: {
          title: "Ready to publish this tool?",
          options: [
            {
              status: ToolStatus.Published,
              title: "Publish now",
              description: "Set this tool live immediately",
              button: {
                onClick: handlePublished,
                children: "Publish",
              },
            },
            {
              status: ToolStatus.Scheduled,
              title: "Schedule for later",
              description: "Set automatic future publish date",
              button: {
                onClick: handleScheduled,
                children: "Schedule",
              },
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Save Draft",
        variant: "primary",
      },
    ],

    [ToolStatus.Scheduled]: [
      {
        type: "button",
        children: "Scheduled",
        variant: "secondary",
        prefix: <Icon name="lucide/calendar" />,
        popover: {
          title: "Update tool status",
          description: (
            <>
              Preview:{" "}
              <ExternalLink href={`/${slug}`} className="text-primary underline">
                {siteConfig.url}/{slug}
              </ExternalLink>
              <br />
              Will be published on <strong>{formatDateTime(publishedAt ?? new Date())}</strong>
            </>
          ),
          options: [
            {
              status: ToolStatus.Draft,
              title: "Revert to draft",
              description: "Do not publish",
              button: {
                onClick: handleDraft,
                children: "Unschedule",
              },
            },
            {
              status: ToolStatus.Scheduled,
              title: "Schedule for later",
              description: "Set automatic future publish date",
              button: {
                onClick: handleScheduled,
                children: "Reschedule",
              },
            },
            {
              status: ToolStatus.Published,
              title: "Publish now",
              description: "Set this tool live immediately",
              button: {
                onClick: handlePublished,
                children: "Publish",
              },
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Update",
        variant: "primary",
      },
    ],

    [ToolStatus.Published]: [
      {
        type: "button",
        children: "Published",
        variant: "secondary",
        prefix: <Icon name="lucide/badge-check" />,
        popover: {
          title: "Update tool status",
          description: (
            <>
              View:{" "}
              <ExternalLink href={`/${slug}`} className="text-primary underline">
                {siteConfig.url}/{slug}
              </ExternalLink>
            </>
          ),
          options: [
            {
              status: ToolStatus.Draft,
              title: "Unpublished",
              description: "Revert this tool to a draft",
              button: {
                onClick: handleDraft,
                children: "Unpublish",
              },
            },
            {
              status: ToolStatus.Published,
              title: "Published",
              description: "Keep this tool publicly available",
            },
          ],
        },
      },
      {
        type: "submit",
        children: "Update",
        variant: "primary",
      },
    ],
  }

  return (
    <Stack size="sm" {...props}>
      {children}

      {toolActions[tool?.status ?? ToolStatus.Draft].map(({ popover, ...action }) => {
        if (popover) {
          const opts = popover.options
          const currentOption = opts.find(o => o.status === currentStatus) || opts[0]

          return (
            <Popover key={String(action.children)} open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button size="md" isPending={isStatusPending} {...action} />
              </PopoverTrigger>

              <PopoverContent
                align="center"
                side="top"
                sideOffset={8}
                className="w-72"
                onOpenAutoFocus={e => e.preventDefault()}
                asChild
              >
                <Stack size="lg" direction="column" className="items-stretch gap-5 min-w-80">
                  <Stack size="sm" direction="column">
                    <H5>{popover.title}</H5>

                    {popover.description && <Note>{popover.description}</Note>}
                  </Stack>

                  <RadioGroup
                    defaultValue={currentOption.status}
                    className="contents"
                    onValueChange={value => setCurrentStatus(value as ToolStatus)}
                  >
                    {opts.map(option => (
                      <Stack size="sm" className="items-start" key={option.status}>
                        <RadioGroupItem
                          id={option.status}
                          value={option.status}
                          className="mt-0.5"
                        />

                        <Stack size="sm" direction="column" className="grow" asChild>
                          <label htmlFor={option.status}>
                            <H6>{option.title}</H6>

                            {option.description && <Note>{option.description}</Note>}

                            {option.status === ToolStatus.Scheduled &&
                              currentStatus === ToolStatus.Scheduled && (
                                <Stack size="sm" wrap={false} className="mt-2 items-stretch w-full">
                                  <Button
                                    size="md"
                                    variant="secondary"
                                    onClick={() => setIsScheduleOpen(true)}
                                    suffix={<Icon name="lucide/calendar" />}
                                    className="w-full tabular-nums"
                                  >
                                    {selectedDate}
                                  </Button>

                                  <Input
                                    type="time"
                                    value={selectedTime}
                                    onChange={e => setSelectedTime(e.target.value)}
                                    className="w-full tabular-nums"
                                  />

                                  <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                                    <DialogContent className="max-w-sm">
                                      <DialogHeader>
                                        <DialogTitle>Pick a date to publish</DialogTitle>
                                      </DialogHeader>

                                      <Calendar
                                        mode="single"
                                        selected={new Date(selectedDate)}
                                        disabled={{ before: new Date() }}
                                        onSelect={date => {
                                          date && setSelectedDate(formatDate(date, "yyyy-MM-dd"))
                                          setIsScheduleOpen(false)
                                        }}
                                        modifiers={{
                                          schedulable: Array.from({ length: 365 }, (_, i) => {
                                            const date = addDays(new Date(), i)
                                            return isMonday(date) ||
                                              isWednesday(date) ||
                                              isFriday(date)
                                              ? date
                                              : undefined
                                          }).filter(isTruthy),
                                        }}
                                        modifiersClassNames={{
                                          schedulable:
                                            "before:absolute before:bottom-0.5 before:left-1/2 before:z-10 before:size-1 before:rounded-full before:bg-chart-1 before:-translate-x-1/2",
                                        }}
                                      />
                                    </DialogContent>
                                  </Dialog>
                                </Stack>
                              )}
                          </label>
                        </Stack>
                      </Stack>
                    ))}
                  </RadioGroup>

                  {submitterEmail &&
                    status !== ToolStatus.Published &&
                    (currentOption.status === ToolStatus.Published ||
                      currentOption.status === ToolStatus.Scheduled) && (
                      <FormField
                        control={control}
                        name="notifySubmitter"
                        render={({ field }) => (
                          <FormItem size="sm" direction="row">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={() => field.onChange(!field.value)}
                              />
                            </FormControl>

                            <FormLabel
                              className={cx(!field.value && "font-normal text-muted-foreground")}
                            >
                              Notify submitter via email
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    )}

                  <Stack className="justify-between">
                    <Button size="md" variant="secondary" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>

                    {currentOption.button && (
                      <Button size="md" isPending={isStatusPending} {...currentOption.button} />
                    )}
                  </Stack>
                </Stack>
              </PopoverContent>
            </Popover>
          )
        }

        return (
          <Button
            key={String(action.children)}
            name="submit"
            size="md"
            isPending={isPending}
            className="lg:min-w-24"
            {...action}
          />
        )
      })}
    </Stack>
  )
}
