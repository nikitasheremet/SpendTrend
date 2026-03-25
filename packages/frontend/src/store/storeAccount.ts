import { authClient } from '@/lib/auth-client'
import type { AccountDetails } from '@/types/account/account'

export async function getAccountDetails(): Promise<AccountDetails> {
  const session = await authClient.getSession()

  if (!session || !session?.data?.user) {
    throw new Error('User not authenticated')
  }

  return {
    userId: session.data.user.id,
    // @ts-expect-error -- This is defined in the custom session callback in the backend
    accountId: session.data.user.accountId,
  }
}
