import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Modal from '../Modal.vue'

type ModalTestProps = {
  isModalOpen?: boolean
  closeOnEsc?: boolean
  closeOnBackdropClick?: boolean
}

describe('Modal', () => {
  it('emits modalClosed when the Close button is clicked', async () => {
    const user = userEvent.setup()
    const { emitted } = renderModal()

    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(emitted().modalClosed).toHaveLength(1)
  })

  describe('closing on Esc', () => {
    it('emits modalClosed when Esc is pressed and closeOnEsc is set', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal({ closeOnEsc: true })

      await user.keyboard('{Escape}')

      expect(emitted().modalClosed).toHaveLength(1)
    })

    it('does nothing when Esc is pressed by default', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal()

      await user.keyboard('{Escape}')

      expect(emitted().modalClosed).toBeUndefined()
    })

    it('ignores Esc while the modal is closed', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal({ closeOnEsc: true, isModalOpen: false })

      await user.keyboard('{Escape}')

      expect(emitted().modalClosed).toBeUndefined()
    })

    it('stops listening for Esc once the modal closes', async () => {
      const user = userEvent.setup()
      const { emitted, rerender } = renderModal({ closeOnEsc: true })

      await rerender({ isModalOpen: false })
      await user.keyboard('{Escape}')

      expect(emitted().modalClosed).toBeUndefined()
    })

    it('starts listening for Esc once the modal opens', async () => {
      const user = userEvent.setup()
      const { emitted, rerender } = renderModal({ closeOnEsc: true, isModalOpen: false })

      await rerender({ isModalOpen: true })
      await user.keyboard('{Escape}')

      expect(emitted().modalClosed).toHaveLength(1)
    })

    it('stops listening for Esc once the modal unmounts', async () => {
      const user = userEvent.setup()
      const { emitted, unmount } = renderModal({ closeOnEsc: true })

      unmount()
      await user.keyboard('{Escape}')

      expect(emitted().modalClosed).toBeUndefined()
    })

    it('ignores keys other than Esc', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal({ closeOnEsc: true })

      await user.keyboard('{Enter}')

      expect(emitted().modalClosed).toBeUndefined()
    })
  })

  describe('closing on backdrop click', () => {
    it('emits modalClosed when the backdrop is clicked and closeOnBackdropClick is set', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal({ closeOnBackdropClick: true })

      await user.click(getBackdrop())

      expect(emitted().modalClosed).toHaveLength(1)
    })

    it('does not emit modalClosed when clicking inside the modal content', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal({ closeOnBackdropClick: true })

      await user.click(screen.getByText('Modal body'))
      await user.click(screen.getByRole('dialog'))

      expect(emitted().modalClosed).toBeUndefined()
    })

    it('does not emit modalClosed when a press starts inside the content and is released on the backdrop', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal({ closeOnBackdropClick: true })

      await user.pointer([
        { keys: '[MouseLeft>]', target: screen.getByText('Modal body') },
        { keys: '[/MouseLeft]', target: getBackdrop() },
      ])

      expect(emitted().modalClosed).toBeUndefined()
    })

    it('does nothing when the backdrop is clicked by default', async () => {
      const user = userEvent.setup()
      const { emitted } = renderModal()

      await user.click(getBackdrop())

      expect(emitted().modalClosed).toBeUndefined()
    })
  })
})

function renderModal(props: ModalTestProps = {}) {
  return render(Modal, {
    props: { isModalOpen: true, ...props },
    slots: { default: '<p>Modal body</p>' },
  })
}

function getBackdrop(): HTMLElement {
  return screen.getByRole('dialog').parentElement!
}
