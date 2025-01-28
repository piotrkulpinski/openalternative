import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const db = globalThis.prismaGlobal ?? prismaClientSingleton()

export { db }

if (process.env.NODE_ENV === "development") globalThis.prismaGlobal = db
