const BASE_URL = import.meta.env.VITE_BACKEND_URL

export async function post<T>(endpoint: string, payload: unknown): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP Error: Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in POST request for url: ', `${endpoint}`, 'Error message:', error)
    throw error
  }
}
