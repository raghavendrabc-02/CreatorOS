// Small wrapper around fetch for calling the CreatorOS backend.
// The backend address comes from VITE_API_URL (see .env.example); locally it defaults to the FastAPI dev server.
export const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/+$/, '')

// An error with a message that can be shown to the user as-is.
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Turns FastAPI's error body into one readable sentence.
function describeError(status, body) {
  if (typeof body?.detail === 'string') return body.detail
  if (Array.isArray(body?.detail)) return 'Some of the values are not valid.'
  return `The server responded with an error (${status}).`
}

export async function apiRequest(path, { method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    // fetch only throws when no response arrived at all: the backend is off or unreachable.
    throw new ApiError(`Can't reach the backend at ${API_URL}. Is it running?`, 0)
  }

  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(describeError(response.status, data), response.status)
  return data
}
