const BASE_URL = 'http://localhost:3000/' // Adjust based on your backend URL

export async function post<T>(endpoint: string, payload: unknown): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
