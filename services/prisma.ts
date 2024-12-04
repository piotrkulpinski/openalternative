import { PrismaClient } from "@prisma/client"
import { isProd } from "~/env"

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export { prisma }

if (!isProd) globalThis.prismaGlobal = prisma
