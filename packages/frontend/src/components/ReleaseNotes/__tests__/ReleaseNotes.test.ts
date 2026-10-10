import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ReleaseNotes from '../ReleaseNotes.vue'
import type { Changelog } from '../changelog'
import { LAST_SEEN_VERSION_KEY } from '../lastSeenVersion'

const UNRELEASED_RELEASE_NOTES = { version: 'unreleased', features: ['Coming soon'], bugFixes: [] }
const CHANGELOG: Changelog = [
  { version: '1.3.0', features: ['Dark mode', 'CSV export'], bugFixes: ['Fixed totals'] },
  { version: '1.2.0', features: [], bugFixes: ['Fixed login redirect'] },
  { version: '1.1.0', features: ['Categories'], bugFixes: [] },
]

describe('ReleaseNotes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the App Version in the footer as a button', () => {
    renderReleaseNotes()

    expect(screen.getByRole('button', { name: 'version: 1.3.0' })).toBeInTheDocument()
  })

  it('shows no modal until the footer version is clicked', () => {
    renderReleaseNotes()

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens every Release Notes in the Changelog from the footer, newest first', async () => {
    const user = userEvent.setup()
    renderReleaseNotes()

    await user.click(screen.getByRole('button', { name: 'version: 1.3.0' }))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('heading', { level: 2, name: 'Release Notes:' })).toBeVisible()
    const versionHeadings = within(dialog).getAllByRole('heading', { level: 3 })
    expect(versionHeadings.map((heading) => heading.textContent)).toEqual([
      '1.3.0',
      '1.2.0',
      '1.1.0',
    ])
  })

  it('shows unreleased Release Notes first when opened from the footer', async () => {
    const user = userEvent.setup()
    renderReleaseNotes({ changelog: [UNRELEASED_RELEASE_NOTES, ...CHANGELOG] })

    await openChangelog(user)

    expect(versionHeadingTexts()).toEqual(['unreleased', '1.3.0', '1.2.0', '1.1.0'])
  })

  it('lists Features and Bug Fixes under each version', async () => {
    const user = userEvent.setup()
    renderReleaseNotes({ changelog: [CHANGELOG[0]] })

    await openChangelog(user)

    const dialog = screen.getByRole('dialog')
    const sectionHeadings = within(dialog).getAllByRole('heading', { level: 4 })
    expect(sectionHeadings.map((heading) => heading.textContent)).toEqual(['Features', 'Bug Fixes'])
    const [featureList, bugFixList] = within(dialog).getAllByRole('list')
    expect(listItemTexts(featureList)).toEqual(['Dark mode', 'CSV export'])
    expect(listItemTexts(bugFixList)).toEqual(['Fixed totals'])
  })

  it('shows placeholder text for empty Features and Bug Fixes', async () => {
    const user = userEvent.setup()
    renderReleaseNotes({ changelog: [CHANGELOG[1], CHANGELOG[2]] })

    await openChangelog(user)

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('No new features this release.')).toBeVisible()
    expect(within(dialog).getByText('No bug fixes this release.')).toBeVisible()
  })

  it('shows only the heading when the Changelog is empty', async () => {
    const user = userEvent.setup()
    renderReleaseNotes({ changelog: [] })

    await openChangelog(user)

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('heading', { level: 2, name: 'Release Notes:' })).toBeVisible()
    expect(within(dialog).queryByRole('heading', { level: 3 })).not.toBeInTheDocument()
  })

  it('shows bullets as plain text, not HTML', async () => {
    const user = userEvent.setup()
    renderReleaseNotes({
      changelog: [{ version: '1.0.0', features: ['<b>Bold</b>'], bugFixes: [] }],
    })

    await openChangelog(user)

    expect(screen.getByText('<b>Bold</b>')).toBeVisible()
  })

  it('leaves localStorage untouched when opening the Changelog from the footer', async () => {
    const user = userEvent.setup()
    const getItem = vi.spyOn(Storage.prototype, 'getItem')
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    renderReleaseNotes()

    await openChangelog(user)

    expect(getItem).not.toHaveBeenCalled()
    expect(setItem).not.toHaveBeenCalled()
    expect(localStorage).toHaveLength(0)
  })

  it('opens the full Changelog from the footer when logged out', async () => {
    const user = userEvent.setup()
    renderReleaseNotes({ isLoggedIn: false })

    await openChangelog(user)

    expect(versionHeadingTexts()).toEqual(['1.3.0', '1.2.0', '1.1.0'])
  })

  describe('automatic popup of unseen Release Notes', () => {
    it('shows only the newest Release Notes when no Last Seen Version is stored', () => {
      renderReleaseNotes({ isLoggedIn: true })

      const dialog = screen.getByRole('dialog')
      expect(
        within(dialog).getByRole('heading', { level: 2, name: 'Release Notes:' }),
      ).toBeVisible()
      expect(versionHeadingTexts()).toEqual(['1.3.0'])
    })

    it('pops up unreleased Release Notes first when no Last Seen Version is stored', () => {
      renderReleaseNotes({ isLoggedIn: true, changelog: [UNRELEASED_RELEASE_NOTES, ...CHANGELOG] })

      expect(versionHeadingTexts()).toEqual(['unreleased', '1.3.0'])
    })

    it('pops up unreleased Release Notes ahead of those above the Last Seen Version', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.1.0')

      renderReleaseNotes({ isLoggedIn: true, changelog: [UNRELEASED_RELEASE_NOTES, ...CHANGELOG] })

      expect(versionHeadingTexts()).toEqual(['unreleased', '1.3.0', '1.2.0'])
    })

    it('pops up unreleased Release Notes on every load, since they have no version to mark as seen', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.3.0')

      renderReleaseNotes({ isLoggedIn: true, changelog: [UNRELEASED_RELEASE_NOTES, ...CHANGELOG] })

      expect(versionHeadingTexts()).toEqual(['unreleased'])
    })

    it('shows the newest Release Notes even when it is older than the App Version', () => {
      renderReleaseNotes({ isLoggedIn: true, appVersion: '2.0.0' })

      expect(versionHeadingTexts()).toEqual(['1.3.0'])
    })

    it('shows every Release Notes above the Last Seen Version, newest first', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.0.0')

      renderReleaseNotes({ isLoggedIn: true })

      expect(versionHeadingTexts()).toEqual(['1.3.0', '1.2.0', '1.1.0'])
    })

    it('skips versions without Release Notes', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.1.0')

      renderReleaseNotes({
        isLoggedIn: true,
        appVersion: '1.4.0',
        changelog: [CHANGELOG[0], CHANGELOG[1]],
      })

      expect(versionHeadingTexts()).toEqual(['1.3.0', '1.2.0'])
    })

    it('leaves out Release Notes above the App Version', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.1.0')

      renderReleaseNotes({ isLoggedIn: true, appVersion: '1.2.0' })

      expect(versionHeadingTexts()).toEqual(['1.2.0'])
    })

    it('shows no modal when there are no unseen Release Notes', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.3.0')

      renderReleaseNotes({ isLoggedIn: true })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('saves the App Version as the Last Seen Version as soon as the Release Notes are shown', () => {
      renderReleaseNotes({ isLoggedIn: true })

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(localStorage.getItem(LAST_SEEN_VERSION_KEY)).toBe('1.3.0')
    })

    it('saves the Last Seen Version even when nothing is shown', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.3.0')

      renderReleaseNotes({ isLoggedIn: true, appVersion: '1.3.1' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(localStorage.getItem(LAST_SEEN_VERSION_KEY)).toBe('1.3.1')
    })

    it('never moves the Last Seen Version backwards', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.4.0')

      renderReleaseNotes({ isLoggedIn: true, appVersion: '1.3.0' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(localStorage.getItem(LAST_SEEN_VERSION_KEY)).toBe('1.4.0')
    })

    it('does not show the same Release Notes again on the next load', () => {
      const { unmount } = renderReleaseNotes({ isLoggedIn: true })
      unmount()

      renderReleaseNotes({ isLoggedIn: true })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('does nothing when logged out', () => {
      renderReleaseNotes({ isLoggedIn: false })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(localStorage).toHaveLength(0)
    })

    it('runs once the user logs in', async () => {
      const { rerender } = renderReleaseNotes({ isLoggedIn: false })

      await rerender({ isLoggedIn: true })

      expect(versionHeadingTexts()).toEqual(['1.3.0'])
      expect(localStorage.getItem(LAST_SEEN_VERSION_KEY)).toBe('1.3.0')
    })

    it('does nothing when the App Version is unknown', () => {
      renderReleaseNotes({ isLoggedIn: true, appVersion: 'unknown' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(localStorage).toHaveLength(0)
    })

    it('does nothing when the App Version is not a plain version, and the footer still works', async () => {
      const user = userEvent.setup()
      renderReleaseNotes({ isLoggedIn: true, appVersion: '1.3.0-beta' })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(localStorage).toHaveLength(0)
      await openChangelog(user)
      expect(versionHeadingTexts()).toEqual(['1.3.0', '1.2.0', '1.1.0'])
    })

    it('treats a localStorage read that throws as nothing stored', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, '1.0.0')
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked')
      })
      vi.spyOn(console, 'error').mockImplementation(() => {})

      renderReleaseNotes({ isLoggedIn: true })

      expect(versionHeadingTexts()).toEqual(['1.3.0'])
    })

    it('treats a stored value that is not a version as nothing stored', () => {
      localStorage.setItem(LAST_SEEN_VERSION_KEY, 'garbage')

      renderReleaseNotes({ isLoggedIn: true })

      expect(versionHeadingTexts()).toEqual(['1.3.0'])
      expect(localStorage.getItem(LAST_SEEN_VERSION_KEY)).toBe('1.3.0')
    })

    it('still shows the Release Notes when saving the Last Seen Version throws', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      vi.spyOn(console, 'error').mockImplementation(() => {})

      renderReleaseNotes({ isLoggedIn: true })

      expect(versionHeadingTexts()).toEqual(['1.3.0'])
    })

    it('opens the full Changelog from the footer after the popup is closed', async () => {
      const user = userEvent.setup()
      renderReleaseNotes({ isLoggedIn: true })
      await user.click(screen.getByRole('button', { name: 'Close' }))

      await openChangelog(user)

      expect(versionHeadingTexts()).toEqual(['1.3.0', '1.2.0', '1.1.0'])
    })
  })

  describe('closing the modal', () => {
    it('closes via the Close button', async () => {
      const user = userEvent.setup()
      renderReleaseNotes()
      await openChangelog(user)

      await user.click(screen.getByRole('button', { name: 'Close' }))

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes via Esc', async () => {
      const user = userEvent.setup()
      renderReleaseNotes()
      await openChangelog(user)

      await user.keyboard('{Escape}')

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('closes via a backdrop click', async () => {
      const user = userEvent.setup()
      renderReleaseNotes()
      await openChangelog(user)

      await user.click(screen.getByRole('dialog').parentElement!)

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})

function renderReleaseNotes(props: Partial<InstanceType<typeof ReleaseNotes>['$props']> = {}) {
  return render(ReleaseNotes, {
    props: { appVersion: '1.3.0', changelog: CHANGELOG, isLoggedIn: false, ...props },
  })
}

async function openChangelog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^version:/ }))
}

function versionHeadingTexts() {
  return within(screen.getByRole('dialog'))
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent)
}

function listItemTexts(list: HTMLElement) {
  return within(list)
    .getAllByRole('listitem')
    .map((item) => item.textContent)
}
