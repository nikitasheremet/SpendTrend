import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
}) as ReturnType<typeof createAuthClient>
