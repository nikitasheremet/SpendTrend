import { reactive } from 'vue'
import type { Store } from './storeInterface'
import { authClient } from '@/lib/auth-client'

let store: Store

export function createStore() {
  store = reactive<Store>({
    getAccountDetails: async () => {
      const session = await authClient.getSession()

      if (!session || !session?.data?.user) {
        throw new Error('User not authenticated')
      }
      return {
        userId: session.data.user.id,
        // @ts-ignore -- This is defined in the custom session callback in the backend
        accountId: session.data.user.accountId,
      }
    },
  })
}

export function getStore(): Store {
  return store
}
