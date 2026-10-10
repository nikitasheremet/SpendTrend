import { compareVersions } from './semver'

export type ReleaseNotesContent = {
  features: string[]
  bugFixes: string[]
}

export type ReleaseNotes = ReleaseNotesContent & {
  version: string
}

export type Changelog = ReleaseNotes[]

export const UNRELEASED_FILE_NAME = 'unreleased'

// Raw JSON from the Release Notes folder, keyed by file path. Loaded eagerly
// at build time, so there is no runtime fetch.
export const releaseNotesFiles: Record<string, unknown> = import.meta.glob(
  '../../releaseNotes/*.json',
  { eager: true, import: 'default' },
)

// Built on call rather than at import, so a badly named file fails the content
// test with a clear message instead of breaking every importer.
export function loadChangelog(): Changelog {
  return buildChangelog(releaseNotesFiles)
}

export function buildChangelog(files: Record<string, unknown>): Changelog {
  return Object.entries(files)
    .map(([path, content]) => {
      const { features, bugFixes } = content as ReleaseNotesContent
      return { version: fileNameFromPath(path), features, bugFixes }
    })
    .sort(newestFirst)
}

// Unreleased Release Notes only exist before a deploy stamps them with a
// version (so never in production), and they are always the newest.
function newestFirst(a: ReleaseNotes, b: ReleaseNotes): number {
  if (a.version === UNRELEASED_FILE_NAME) return -1
  if (b.version === UNRELEASED_FILE_NAME) return 1
  return compareVersions(b.version, a.version)
}

export function fileNameFromPath(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.json$/, '')
}
