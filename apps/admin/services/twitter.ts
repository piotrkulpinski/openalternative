import crypto from "node:crypto"
import { env, isProd } from "~/env"

/**
 * Generate a Base64-encoded HMAC-SHA1 signature for OAuth 1.0a
 * @param httpMethod - The HTTP method (GET, POST, etc.)
 * @param baseUrl - The base URL of the API endpoint
 * @param params - The OAuth and request parameters
 * @param consumerSecret - Your OAuth consumer secret
 * @param tokenSecret - Your OAuth token secret (optional)
 * @returns The generated OAuth signature
 */
function generateOAuthSignature(
  httpMethod: string,
  baseUrl: string,
  params: Record<string, string>,
) {
  const consumerSecret = env.TWITTER_API_SECRET
  const tokenSecret = env.TWITTER_ACCESS_SECRET

  // Normalize parameters
  const normalizedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key] || "")}`)
    .join("&")

  // Create the base string
  const baseString = `${httpMethod.toUpperCase()}&${encodeURIComponent(baseUrl)}&${encodeURIComponent(normalizedParams)}`

  // Create the signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`

  // Generate HMAC-SHA1 signature
  const hmac = crypto.createHmac("sha1", signingKey)
  hmac.update(baseString)

  return hmac.digest("base64")
}

/**
 * Make an authenticated request to an API endpoint using OAuth 1.0a
 * @param httpMethod - The HTTP method (GET, POST, etc.)
 * @param baseUrl - The base URL of the API endpoint
 * @param [jsonBody] - The JSON body to send with the request
 */
export async function makeOAuthRequest(
  httpMethod: string,
  baseUrl: string,
  jsonBody?: Record<string, unknown>,
) {
  const params = {
    oauth_consumer_key: env.TWITTER_API_KEY,
    oauth_token: env.TWITTER_ACCESS_TOKEN,
    oauth_nonce: crypto.randomBytes(16).toString("base64"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: "1.0",
  }
  // Generate the OAuth signature
  const oauthSignature = generateOAuthSignature(httpMethod, baseUrl, params)

  // Construct the OAuth header
  const oauthHeader = Object.entries({
    ...params,
    oauth_signature: oauthSignature,
  })
    .map(([key, value]) => `${encodeURIComponent(key)}="${encodeURIComponent(value)}"`)
    .join(", ")

  const headers: Record<string, string> = {
    Authorization: `OAuth ${oauthHeader}`,
  }

  if (jsonBody) {
    headers["Content-Type"] = "application/json"
  }

  try {
    // Make the HTTP request using Fetch API
    const response = await fetch(baseUrl, {
      method: httpMethod,
      headers,
      body: jsonBody ? JSON.stringify(jsonBody) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Response:", data)
    return data
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}

/**
 * Send a tweet to Twitter
 * @param text - The text of the tweet
 */
export const sendTweet = async (text: string) => {
  const httpMethod = "POST"
  const baseUrl = "https://api.twitter.com/2/tweets"

  isProd && (await makeOAuthRequest(httpMethod, baseUrl, { text }))
}
