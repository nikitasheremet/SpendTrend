import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import DropdownOptions from '../DropdownOptions.vue'

describe('DropdownOptions', () => {
  const fakeProps = {
    options: ['optionA', 'optionB'],
    optionsStyle: {
      top: '10px',
      left: '20px',
      width: '160px',
    },
  }
  describe('when an array of strings is passed in', () => {
    it('should render the list of strings', () => {
      render(DropdownOptions, {
        props: fakeProps,
      })
      screen.getByText('optionA')
      screen.getByText('optionB')
    })
  })
  describe('when an option is clicked', () => {
    it('should emit a clicked event with the string value of the option', async () => {
      const { emitted } = render(DropdownOptions, {
        props: fakeProps,
      })
      await userEvent.click(screen.getByText('optionA'))
      const emittedEventName = 'dropdownOptionClick'
      const emittedEvents = emitted()
      expect(emittedEvents[emittedEventName]).toEqual([['optionA']])
    })
  })
  describe('when dropdown options are rendered', () => {
    it('should apply fixed positioning style, max height, scroll and wrapping classes', () => {
      render(DropdownOptions, {
        props: fakeProps,
      })

      const dropdownOptionsContainer = document.querySelector('.dropdown-options') as HTMLElement
      expect(dropdownOptionsContainer).toBeTruthy()
      expect(dropdownOptionsContainer.style.top).toBe('10px')
      expect(dropdownOptionsContainer.style.left).toBe('20px')
      expect(dropdownOptionsContainer.style.width).toBe('160px')
      expect(dropdownOptionsContainer.className).toContain('max-h-[200px]')
      expect(dropdownOptionsContainer.className).toContain('overflow-y-auto')

      const dropdownOption = screen.getByText('optionA').parentElement as HTMLElement
      expect(dropdownOption.className).toContain('whitespace-normal')
      expect(dropdownOption.className).toContain('wrap-break-word')
    })
  })
  describe('when searchable is false', () => {
    it('should not render a search input', () => {
      render(DropdownOptions, {
        props: fakeProps,
      })

      expect(screen.queryByPlaceholderText('Search...')).toBeNull()
    })

    it('should not render a create button even if onCreateOption is provided', () => {
      render(DropdownOptions, {
        props: {
          ...fakeProps,
          onCreateOption: vi.fn(),
        },
      })

      expect(screen.queryByRole('button')).toBeNull()
    })
  })
  describe('when searchable is true', () => {
    it('should render a search input and filter options by substring', async () => {
      render(DropdownOptions, {
        props: {
          ...fakeProps,
          searchable: true,
        },
      })

      const searchInput = screen.getByPlaceholderText('Search...')
      await userEvent.type(searchInput, 'A')

      screen.getByText('optionA')
      expect(screen.queryByText('optionB')).toBeNull()
    })

    it('should not render a create button when onCreateOption is not provided', () => {
      render(DropdownOptions, {
        props: {
          ...fakeProps,
          searchable: true,
        },
      })

      expect(screen.queryByRole('button')).toBeNull()
    })

    describe('and onCreateOption is provided', () => {
      it('should render a create button showing the current search text', async () => {
        render(DropdownOptions, {
          props: {
            ...fakeProps,
            searchable: true,
            onCreateOption: vi.fn(),
          },
        })

        const searchInput = screen.getByPlaceholderText('Search...')
        await userEvent.type(searchInput, 'newOption')

        screen.getByText('Create "newOption"')
      })

      it('should disable the create button when the search text is empty', () => {
        render(DropdownOptions, {
          props: {
            ...fakeProps,
            searchable: true,
            onCreateOption: vi.fn(),
          },
        })

        expect(screen.getByRole('button')).toBeDisabled()
      })

      it('should disable the create button when the search text matches an existing option (case-insensitive)', async () => {
        render(DropdownOptions, {
          props: {
            ...fakeProps,
            searchable: true,
            onCreateOption: vi.fn(),
          },
        })

        const searchInput = screen.getByPlaceholderText('Search...')
        await userEvent.type(searchInput, 'optiona')

        expect(screen.getByRole('button')).toBeDisabled()
      })

      it('should invoke the callback and emit optionCreated on success', async () => {
        const onCreateOption = vi.fn().mockResolvedValue('newOption')
        const { emitted } = render(DropdownOptions, {
          props: {
            ...fakeProps,
            searchable: true,
            onCreateOption,
          },
        })

        const searchInput = screen.getByPlaceholderText('Search...')
        await userEvent.type(searchInput, 'newOption')
        await userEvent.click(screen.getByRole('button'))

        expect(onCreateOption).toHaveBeenCalledWith('newOption')
        await waitFor(() => {
          expect(emitted().optionCreated).toEqual([['newOption']])
        })
      })

      it('should show a loading state while creating and disable the button', async () => {
        let resolveCreate!: (value: string) => void
        const onCreateOption = vi.fn(
          () =>
            new Promise<string>((resolve) => {
              resolveCreate = resolve
            }),
        )
        render(DropdownOptions, {
          props: {
            ...fakeProps,
            searchable: true,
            onCreateOption,
          },
        })

        const searchInput = screen.getByPlaceholderText('Search...')
        await userEvent.type(searchInput, 'newOption')
        await userEvent.click(screen.getByRole('button'))

        screen.getByText('Creating...')
        expect(screen.getByRole('button')).toBeDisabled()

        resolveCreate('newOption')
        await waitFor(() => {
          screen.getByText('Create "newOption"')
        })
      })

      it('should show an error message when creation fails and keep the panel usable', async () => {
        const onCreateOption = vi.fn().mockRejectedValue(new Error('Category already exists'))
        const { emitted } = render(DropdownOptions, {
          props: {
            ...fakeProps,
            searchable: true,
            onCreateOption,
          },
        })

        const searchInput = screen.getByPlaceholderText('Search...')
        await userEvent.type(searchInput, 'newOption')
        await userEvent.click(screen.getByRole('button'))

        await waitFor(() => {
          screen.getByText('Category already exists')
        })
        expect(emitted().optionCreated).toBeUndefined()
      })
    })
  })
})
