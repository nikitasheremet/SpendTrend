import { reactive } from 'vue'
import type { Store } from './storeInterface'

let store: Store

export function createStore() {
  store = reactive<Store>({
    getAccountDetails: () => {
      return {
        userId: '10000000-0a00-0a0a-0a00-00aaaa0a000a',
        accountId: '20000000-0a00-0a0a-0a00-00aaaa0a000a',
      }
    },
  })
}

export function getStore(): Store {
  return store
}
