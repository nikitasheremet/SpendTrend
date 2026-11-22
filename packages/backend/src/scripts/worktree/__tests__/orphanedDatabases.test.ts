import { orphanedWorktreeDatabases } from '../orphanedDatabases'

describe('orphanedWorktreeDatabases', () => {
  it('picks the worktree databases whose worktree folder is gone', () => {
    expect(
      orphanedWorktreeDatabases(
        ['spend_trend_w0012', 'spend_trend_w0090', 'spend_trend_w0101'],
        ['w-0090'],
      ),
    ).toEqual(['spend_trend_w0012', 'spend_trend_w0101'])
  })

  it('never picks the main database or databases that are not worktree databases', () => {
    expect(
      orphanedWorktreeDatabases(
        ['spend_trend', 'postgres', 'template1', 'spend_trend_wip', 'spend_trend_w12'],
        [],
      ),
    ).toEqual([])
  })

  it('ignores folders that are not worktree folders', () => {
    expect(orphanedWorktreeDatabases(['spend_trend_w0090'], ['0090', 'notes'])).toEqual([
      'spend_trend_w0090',
    ])
  })
})
