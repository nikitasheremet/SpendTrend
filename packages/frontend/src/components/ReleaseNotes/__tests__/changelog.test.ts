import { describe, expect, it } from 'vitest'
import { buildChangelog } from '../changelog'

describe('buildChangelog', () => {
  it('names each Release Notes after its file and sorts newest first by semver', () => {
    const changelog = buildChangelog({
      '../../releaseNotes/0.1.9.json': { features: ['a'], bugFixes: [] },
      '../../releaseNotes/0.1.10.json': { features: ['b'], bugFixes: [] },
      '../../releaseNotes/0.2.0.json': { features: [], bugFixes: ['c'] },
    })

    expect(changelog).toEqual([
      { version: '0.2.0', features: [], bugFixes: ['c'] },
      { version: '0.1.10', features: ['b'], bugFixes: [] },
      { version: '0.1.9', features: ['a'], bugFixes: [] },
    ])
  })

  it('puts unreleased.json first, ahead of every version', () => {
    const changelog = buildChangelog({
      '../../releaseNotes/1.0.0.json': { features: ['done'], bugFixes: [] },
      '../../releaseNotes/unreleased.json': { features: ['wip'], bugFixes: [] },
      '../../releaseNotes/2.0.0.json': { features: ['newer'], bugFixes: [] },
    })

    expect(changelog).toEqual([
      { version: 'unreleased', features: ['wip'], bugFixes: [] },
      { version: '2.0.0', features: ['newer'], bugFixes: [] },
      { version: '1.0.0', features: ['done'], bugFixes: [] },
    ])
  })

  it('takes the version only from the filename, never from the file contents', () => {
    const changelog = buildChangelog({
      '../../releaseNotes/1.0.0.json': { version: '9.9.9', features: ['a'], bugFixes: [] },
    })

    expect(changelog).toEqual([{ version: '1.0.0', features: ['a'], bugFixes: [] }])
  })
})
