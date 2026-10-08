import type { Changelog } from './changelog'
import { compareVersions, SEMVER_PATTERN } from './semver'

export const LAST_SEEN_VERSION_KEY = 'spendtrend_last_seen_version'

// Picks the Release Notes the user hasn't seen yet and records the App Version
// as seen. Saves immediately, so a reload while the modal is open doesn't show
// the same Release Notes again.
export function takeUnseenReleaseNotes(changelog: Changelog, appVersion: string): Changelog {
  // Covers `unknown` (local dev) and anything else compareVersions can't parse.
  if (!SEMVER_PATTERN.test(appVersion)) return []
  const lastSeenVersion = loadLastSeenVersion()
  if (!lastSeenVersion || compareVersions(appVersion, lastSeenVersion) > 0) {
    saveLastSeenVersion(appVersion)
  }
  return unseenReleaseNotes(changelog, appVersion, lastSeenVersion)
}

function loadLastSeenVersion(): string | null {
  try {
    const stored = localStorage.getItem(LAST_SEEN_VERSION_KEY)
    return stored && SEMVER_PATTERN.test(stored) ? stored : null
  } catch (error) {
    console.error('Error loading last seen version from localStorage:', error)
    return null
  }
}

function saveLastSeenVersion(version: string) {
  try {
    localStorage.setItem(LAST_SEEN_VERSION_KEY, version)
  } catch (error) {
    console.error('Error saving last seen version to localStorage:', error)
  }
}

function unseenReleaseNotes(
  changelog: Changelog,
  appVersion: string,
  lastSeenVersion: string | null,
): Changelog {
  if (!lastSeenVersion) return changelog.slice(0, 1)
  return changelog.filter(
    ({ version }) =>
      compareVersions(version, lastSeenVersion) > 0 && compareVersions(version, appVersion) <= 0,
  )
}
