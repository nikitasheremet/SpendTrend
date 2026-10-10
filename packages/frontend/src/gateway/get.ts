import { throwIfNotOk } from './throwIfNotOk'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

export async function get<T>(endpoint: string, queryParams: Record<string, string>): Promise<T> {
  try {
    const url = new URL(`${BASE_URL}/${endpoint}`)
    Object.entries(queryParams).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    throwIfNotOk(response)

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in GET request for url: ', `${endpoint}`, 'Error message:', error)
    throw error
  }
}
