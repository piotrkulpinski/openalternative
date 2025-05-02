import { S3Client } from "@aws-sdk/client-s3"
import { env } from "~/env"

export const s3Client = new S3Client({
  region: env.S3_REGION,
  maxAttempts: 5,
  retryMode: "standard",
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})
