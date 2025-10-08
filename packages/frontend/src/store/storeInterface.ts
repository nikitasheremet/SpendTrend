import { AccountDetails } from '../types/account/account'

export interface Store {
  getAccountDetails: () => Promise<AccountDetails>
}
