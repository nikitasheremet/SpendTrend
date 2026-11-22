// npm run agent:down: stops the servers npm run agent:up started for this checkout (W-0090).
// The database stays; npm run worktree:remove drops it.
import { currentCheckout } from './checkout'
import { stopServers } from './servers'

const stopped = await stopServers(currentCheckout().root)
console.log(stopped ? 'Stopped the backend and frontend.' : 'Nothing was running.')
