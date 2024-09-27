"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { createLicense, updateLicense } from "~/app/(dashboard)/licenses/_lib/actions"
import type { getLicenseById } from "~/app/(dashboard)/licenses/_lib/queries"
import { type LicenseSchema, licenseSchema } from "~/app/(dashboard)/licenses/_lib/validations"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { cx } from "~/utils/cva"
import { getSlug, nullsToUndefined } from "~/utils/helpers"

type LicenseFormProps = React.HTMLAttributes<HTMLFormElement> & {
  license?: Awaited<ReturnType<typeof getLicenseById>>
}

export function LicenseForm({ children, className, license, ...props }: LicenseFormProps) {
  const [isSubmitPending, startSubmitTransition] = React.useTransition()

  const form = useForm<LicenseSchema>({
    resolver: zodResolver(licenseSchema),
    defaultValues: nullsToUndefined(license),
  })

  function onSubmit(input: LicenseSchema) {
    startSubmitTransition(async () => {
      const payload = {
        ...input,
        slug: input.slug || getSlug(input.name),
      }

      const { error, data } = license
        ? await updateLicense(license.id, payload)
        : await createLicense(payload)

      if (error) {
        toast.error(error)
        return
      }

      toast.success(`License successfully ${license ? "updated" : "created"}`)

      if (!license && data) {
        redirect(`/licenses/${data.id}`)
      }
    })
  }

  React.useEffect(() => {
    form.reset(nullsToUndefined(license))
  }, [license, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cx("grid grid-cols-1 gap-4 max-w-3xl sm:grid-cols-2", className)}
        noValidate
        {...props}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="MIT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/licenses">Cancel</Link>
          </Button>

          <Button isPending={isSubmitPending} disabled={isSubmitPending}>
            {license ? "Update license" : "Create license"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
