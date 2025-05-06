import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { stripURLSubpath } from "@curiousleaf/utils"
import wretch from "wretch"
import QueryStringAddon from "wretch/addons/queryString"
import { env, isProd } from "~/env"
import { s3Client } from "~/services/s3"
import { tryCatch } from "~/utils/helpers"

/**
 * Uploads a file to S3 and returns the S3 location.
 * @param file - The file to upload.
 * @param key - The S3 key to upload the file to.
 * @returns The S3 location of the uploaded file.
 */
export const uploadToS3Storage = async (file: Buffer, key: string) => {
  const endpoint = env.S3_PUBLIC_URL ?? `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com`

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: file,
      StorageClass: "STANDARD",
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false,
  })

  const result = await upload.done()

  if (!result.Key) {
    throw new Error("Failed to upload")
  }

  return `${endpoint}/${key}?v=${Date.now()}`
}

/**
 * Removes a list of directories from S3.
 * @param directories - The directories to remove.
 */
export const removeS3Directories = async (directories: string[]) => {
  for (const directory of directories) {
    await removeS3Directory(directory)
  }
}

/**
 * Removes a directory from S3.
 * @param directory - The directory to remove.
 */
export const removeS3Directory = async (directory: string) => {
  // Safety flag to prevent accidental deletion of S3 files
  if (!isProd) return

  const listCommand = new ListObjectsV2Command({
    Bucket: env.S3_BUCKET,
    Prefix: `${directory}/`,
  })

  let continuationToken: string | undefined

  do {
    const listResponse = await s3Client.send(listCommand)
    for (const object of listResponse.Contents || []) {
      if (object.Key) {
        await removeS3File(object.Key)
      }
    }
    continuationToken = listResponse.NextContinuationToken
    listCommand.input.ContinuationToken = continuationToken
  } while (continuationToken)
}

/**
 * Removes a file from S3.
 * @param key - The S3 key of the file to remove.
 */
export const removeS3File = async (key: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  })

  return await s3Client.send(deleteCommand)
}

/**
 * Types for media upload
 */
type MediaUploadParams = {
  endpointUrl: string
  s3Key: string
  options?: Record<string, string>
}

/**
 * Uploads media to S3 and returns the S3 location.
 * @param params - The parameters for uploading media.
 * @returns The S3 location of the uploaded media.
 */
export const uploadMedia = async ({ endpointUrl, s3Key, options = {} }: MediaUploadParams) => {
  const response = await tryCatch(
    wretch(endpointUrl)
      .addon(QueryStringAddon)
      .query(options)
      .get()
      .badRequest(console.error)
      .arrayBuffer()
      .then(buffer => Buffer.from(buffer)),
  )

  if (response.error) {
    console.error("Error fetching media:", response.error)
    throw response.error
  }

  // Upload to S3
  const { data, error } = await tryCatch(uploadToS3Storage(response.data, s3Key))

  if (error) {
    console.error("Error uploading media:", error)
    throw error
  }

  return data
}

/**
 * Uploads a favicon to S3 and returns the S3 location.
 * @param url - The URL of the website to fetch the favicon from.
 * @param s3Key - The S3 key to upload the favicon to.
 * @returns The S3 location of the uploaded favicon.
 */
export const uploadFavicon = async (url: string, s3Key: string) => {
  const options = {
    domain_url: stripURLSubpath(url),
    sz: "128",
  }

  return uploadMedia({
    endpointUrl: "https://www.google.com/s2/favicons",
    s3Key: `${s3Key}/favicon.png`,
    options,
  })
}

/**
 * Uploads a screenshot to S3 and returns the S3 location.
 * @param url - The URL of the website to fetch the screenshot from.
 * @param s3Key - The S3 key to upload the screenshot to.
 * @returns The S3 location of the uploaded screenshot.
 */
export const uploadScreenshot = async (url: string, s3Key: string) => {
  const options = {
    url,
    access_key: env.SCREENSHOTONE_ACCESS_KEY,

    // Cache
    cache: "true",
    cache_ttl: "2592000",

    // Emulations
    dark_mode: "true",
    reduced_motion: "true",

    // Blockers
    delay: "1",
    block_ads: "true",
    block_chats: "true",
    block_trackers: "true",
    block_cookie_banners: "true",

    // Image and viewport options
    format: "webp",
    viewport_width: "1280",
    viewport_height: "720",
    image_quality: "90",
  }

  return uploadMedia({
    endpointUrl: "https://api.screenshotone.com/take",
    s3Key: `${s3Key}/screenshot.webp`,
    options,
  })
}
