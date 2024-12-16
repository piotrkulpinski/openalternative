"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { redirect } from "next/navigation"
import type React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { Button } from "~/components/admin/ui/button"
import { Input } from "~/components/admin/ui/input"
import { Textarea } from "~/components/admin/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { createLicense, updateLicense } from "~/server/admin/licenses/actions"
import type { findLicenseBySlug } from "~/server/admin/licenses/queries"
import { type LicenseSchema, licenseSchema } from "~/server/admin/licenses/validations"
import { cx } from "~/utils/cva"
import { nullsToUndefined } from "~/utils/helpers"

type LicenseFormProps = React.HTMLAttributes<HTMLFormElement> & {
  license?: Awaited<ReturnType<typeof findLicenseBySlug>>
}

export function LicenseForm({ children, className, license, ...props }: LicenseFormProps) {
  const form = useForm<LicenseSchema>({
    resolver: zodResolver(licenseSchema),
    defaultValues: nullsToUndefined(license),
  })

  // Create license
  const { execute: createLicenseAction, isPending: isCreatingLicense } = useServerAction(
    createLicense,
    {
      onSuccess: ({ data }) => {
        toast.success("License successfully created")
        redirect(`/admin/licenses/${data.slug}`)
      },

      onError: ({ err }) => {
        toast.error(err.message)
      },
    },
  )

  // Update license
  const { execute: updateLicenseAction, isPending: isUpdatingLicense } = useServerAction(
    updateLicense,
    {
      onSuccess: ({ data }) => {
        toast.success("License successfully updated")
        redirect(`/admin/licenses/${data.slug}`)
      },

      onError: ({ err }) => {
        toast.error(err.message)
      },
    },
  )

  const onSubmit = form.handleSubmit(data => {
    license ? updateLicenseAction({ id: license.id, ...data }) : createLicenseAction(data)
  })

  const isPending = isCreatingLicense || isUpdatingLicense

  return (
    <Form {...form}>
      <form
        onSubmit={onSubmit}
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

        <div className="flex justify-between gap-4 col-span-full">
          <Button variant="outline" asChild>
            <Link href="/admin/licenses">Cancel</Link>
          </Button>

          <Button isPending={isPending} disabled={isPending}>
            {license ? "Update license" : "Create license"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
