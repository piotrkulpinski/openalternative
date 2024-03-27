import { CompleteMultipartUploadCommandOutput, S3Client, S3ClientConfig } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

const cfg: S3ClientConfig = {
  region: process.env.S3_REGION!,
  maxAttempts: 5,
  retryMode: "standard",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  // endpoint: process.env.S3_ENDPOINT ?? "http://localhost:4566",
  forcePathStyle: true,
}

export const s3Client = new S3Client(cfg)

export async function uploadToS3Storage(screenshot: Buffer, key: string) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.S3_BUCKET!,
      Key: key,
      Body: screenshot,
      StorageClass: "STANDARD",
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false,
  })

  const result: CompleteMultipartUploadCommandOutput = await upload.done()

  if (!result.Location) {
    throw new Error("Failed to upload")
  }

  return result.Location
}
