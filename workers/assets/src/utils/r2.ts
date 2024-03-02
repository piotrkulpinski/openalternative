type UploadImageToR2 = {
  url: string
  filename: string
  bucket: R2Bucket
}

export const uploadImageToR2 = async ({ url, filename, bucket }: UploadImageToR2) => {
  const imageResponse = await fetch(url)

  if (!imageResponse.ok) {
    throw new Response("Failed to fetch the image.", { status: 500 })
  }

  return await bucket.put(filename, imageResponse.body)
}
