import { isAxiosError } from "axios"

// The API's single error contract: { success: false, message, errors }
interface ApiErrorBody {
  success?: boolean
  message?: string
  errors?: string[] | string
}

const STATUS_MESSAGES: Record<number, string> = {
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  413: "That file is too large.",
  429: "Too many requests. Please wait a moment and try again.",
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data

    // 1. The server's own message, plus any field-level details
    if (body?.message) {
      const details = Array.isArray(body.errors) ? body.errors.join(", ") : body.errors
      return details ? `${body.message}` : body.message
    }

    // 2. No response at all (server down, no internet, CORS)
    if (error.code === "ERR_NETWORK") return "Network error. Please check your connection."
    if (error.code === "ECONNABORTED") return "The request timed out. Please try again."

    // 3. A response with no message
    const status = error.response?.status
    if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status]
    if (status && status >= 500) return "The server had a problem. Please try again later."

    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}


// export function getErrorMessage(error: unknown): string {
//   if (isAxiosError(error)) {
//     // Server replied with an error body: { success: false, message: "..." }
//     const serverMessage = error.response?.data?.message
//     if (serverMessage) return serverMessage

//     // No response at all (server down, no internet, CORS)
//     if (error.code === "ERR_NETWORK") {
//       return "Network error. Please check your connection."
//     }
//     return error.message
//   }
//   if (error instanceof Error) return error.message
//   return "Something went wrong"
// }