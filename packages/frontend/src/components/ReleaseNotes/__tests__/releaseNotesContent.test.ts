import { describe, expect, it } from 'vitest'
import {
  type ReleaseNotesContent,
  fileNameFromPath,
  loadChangelog,
  releaseNotesFiles,
  UNRELEASED_FILE_NAME,
} from '../changelog'
import { isValidVersion } from '../semver'

// Checks the real Release Notes folder, loaded the same way the app loads it.
describe('Release Notes folder content', () => {
  const files = Object.entries(releaseNotesFiles)

  it.each(files)('%s has a valid name and shape', (path, content) => {
    const fileName = fileNameFromPath(path)
    if (fileName !== UNRELEASED_FILE_NAME) {
      expect(isValidVersion(fileName), `"${fileName}" is not a valid semver version`).toBe(true)
    }
    if (!isReleaseNotesContent(content)) {
      expect.fail('expected exactly { features: string[], bugFixes: string[] }')
    }
    const { features, bugFixes } = content
    expect(
      features.length + bugFixes.length,
      'features and bugFixes are both empty',
    ).toBeGreaterThan(0)
  })

  it('builds the Changelog from the folder', () => {
    expect(() => loadChangelog()).not.toThrow()
  })
})

function isReleaseNotesContent(content: unknown): content is ReleaseNotesContent {
  if (typeof content !== 'object' || content === null) return false
  if (Object.keys(content).sort().join(',') !== 'bugFixes,features') return false
  const { features, bugFixes } = content as Record<string, unknown>
  return isStringArray(features) && isStringArray(bugFixes)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}
