import { localEnvironmentFor } from '../localEnvironment'

describe('localEnvironmentFor', () => {
  it('gives a worktree its own ports and database, numbered after the work item', () => {
    expect(localEnvironmentFor('/home/me/SpendTrend/.claude/worktrees/w-0090')).toEqual({
      worktreeNumber: '0090',
      frontendPort: 20090,
      backendPort: 30090,
      databaseName: 'spend_trend_w0090',
    })
  })

  it('keeps the usual ports and database for the main checkout', () => {
    expect(localEnvironmentFor('/home/me/SpendTrend')).toEqual({
      worktreeNumber: undefined,
      frontendPort: 5173,
      backendPort: 3000,
      databaseName: 'spend_trend',
    })
  })

  it('treats a folder named like a worktree outside .claude/worktrees as a main checkout', () => {
    expect(localEnvironmentFor('/home/me/w-0090').databaseName).toBe('spend_trend')
  })
})
