"use server"

import type { License, Prisma } from "@openalternative/db"
import slugify from "@sindresorhus/slugify"
import { unstable_noStore as noStore, revalidatePath } from "next/cache"
import { getErrorMessage } from "~/lib/handle-error"
import { prisma } from "~/services/prisma"

export async function createLicense(input: Prisma.LicenseCreateInput) {
  noStore()
  try {
    const license = await prisma.license.create({
      data: {
        ...input,
        slug: slugify(input.name),
      },
    })

    revalidatePath("/licenses")

    return {
      data: license,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateLicense(id: string, input: Prisma.LicenseUpdateInput) {
  noStore()
  try {
    const license = await prisma.license.update({
      where: { id },
      data: input,
    })

    revalidatePath("/licenses")

    return {
      data: license,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function updateLicenses(input: {
  ids: License["id"][]
  data: Prisma.LicenseUpdateInput
}) {
  noStore()
  try {
    await prisma.license.updateMany({
      where: { id: { in: input.ids } },
      data: input.data,
    })

    revalidatePath("/licenses")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteLicense(input: { id: License["id"] }) {
  try {
    await prisma.license.delete({
      where: { id: input.id },
    })

    revalidatePath("/licenses")
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function deleteLicenses(input: { ids: License["id"][] }) {
  try {
    await prisma.license.deleteMany({
      where: { id: { in: input.ids } },
    })

    revalidatePath("/licenses")

    return {
      data: null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}

export async function getChunkedLicenses(input: { chunkSize?: number } = {}) {
  try {
    const chunkSize = input.chunkSize ?? 1000

    const totalLicenses = await prisma.license.count()
    const totalChunks = Math.ceil(totalLicenses / chunkSize)

    let chunkedLicenses: License[] = []

    for (let i = 0; i < totalChunks; i++) {
      chunkedLicenses = await prisma.license.findMany({
        take: chunkSize,
        skip: i * chunkSize,
      })
    }

    return {
      data: chunkedLicenses,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    }
  }
}
