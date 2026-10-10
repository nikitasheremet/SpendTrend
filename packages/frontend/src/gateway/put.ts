import { throwIfNotOk } from './throwIfNotOk'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export async function put<T>(endpoint: string, payload: unknown): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    })

    throwIfNotOk(response)

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in PUT request for url: ', `${endpoint}`, 'Error message:', error)
    throw error
  }
}
