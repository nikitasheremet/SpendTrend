import { authClient } from '@/lib/auth-client'

export async function isUserSessionActive(): Promise<boolean> {
  const { data: session } = await authClient.getSession()
  const sessionData = session?.session
  if (!sessionData || new Date() > new Date(sessionData.expiresAt)) {
    return false
  }
  return true
}
