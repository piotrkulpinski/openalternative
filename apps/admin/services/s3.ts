import { S3Client, type S3ClientConfig } from "@aws-sdk/client-s3"
import { env } from "~/env"

const cfg: S3ClientConfig = {
  region: env.S3_REGION,
  maxAttempts: 5,
  retryMode: "standard",
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
}

export const s3Client = new S3Client(cfg)
