import { reactive } from 'vue'
import type { Store } from './storeInterface'

let store: Store

export function createStore() {
  store = reactive<Store>({
    getAccountDetails: () => {
      return {
        userId: '76ddba1c-4e62-428e-80d1-57662dcc7f7c',
        accountId: '76ddba1c-4e62-428e-80d1-57662dcc7f8a',
      }
    },
  })
}

export function getStore(): Store {
  return store
}
