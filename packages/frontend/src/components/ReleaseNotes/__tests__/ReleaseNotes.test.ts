import { render, screen, within } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ReleaseNotes from '../ReleaseNotes.vue'
import type { Changelog } from '../changelog'

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

  it('opens the Changelog from the footer when logged out', async () => {
    const user = userEvent.setup()
    renderReleaseNotes({ isLoggedIn: false })

    await openChangelog(user)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
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
    props: { appVersion: '1.3.0', isLoggedIn: true, changelog: CHANGELOG, ...props },
  })
}

async function openChangelog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /^version:/ }))
}

function listItemTexts(list: HTMLElement) {
  return within(list)
    .getAllByRole('listitem')
    .map((item) => item.textContent)
}
