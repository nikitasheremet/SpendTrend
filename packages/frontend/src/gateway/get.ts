import { handleUnauthorized } from './handleUnathorized'

const BASE_URL = 'http://localhost:3000/' // Adjust based on your backend URL

export async function get<T>(endpoint: string, queryParams: Record<string, string>): Promise<T> {
  try {
    const url = new URL(`${BASE_URL}${endpoint}`)
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

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthorized() // Handle unauthorized access
      } else {
        throw new Error(`HTTP Error: Status: ${response.status}`)
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in GET request for url: ', `${endpoint}`, 'Error message:', error)
    throw error
  }
}
