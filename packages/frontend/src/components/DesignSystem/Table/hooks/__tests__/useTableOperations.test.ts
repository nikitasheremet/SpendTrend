import { describe, it, expect, vi } from 'vitest'
import { nextTick, unref, type Ref } from 'vue'
import { mount } from '@vue/test-utils'
import {
  useTableOperations,
  type TableOperationsOptions,
  type TableOperationsReturn,
} from '../useTableOperations'

interface FakeRow {
  id?: string
  name: string
  amount?: number
  category?: string
  [key: string]: unknown
}

type FakeOptions = TableOperationsOptions<FakeRow>
type MaybeRefValue<T> = T | Ref<T>

type FlexibleTableOperationsReturn<T> = {
  [K in keyof TableOperationsReturn<T>]: TableOperationsReturn<T>[K] extends Ref<infer TValue>
    ? MaybeRefValue<TValue>
    : TableOperationsReturn<T>[K]
}

type FakeTableOperationsVm = FlexibleTableOperationsReturn<FakeRow>

const TestComponent = {
  template: '<div></div>',
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  setup(props: { options: FakeOptions }) {
    return useTableOperations(props.options)
  },
}

function createEmptyRow(): FakeRow {
  return { name: '', amount: 0 }
}

function mountTableOperations(overrides: Partial<FakeOptions> = {}) {
  return mount(TestComponent, {
    props: {
      options: {
        mode: 'editable',
        createEmptyRow,
        ...overrides,
      },
    },
  })
}

function readMaybeRef<T>(value: MaybeRefValue<T>): T {
  return unref(value)
}

function getVm(wrapper: ReturnType<typeof mountTableOperations>): FakeTableOperationsVm {
  return wrapper.vm as unknown as FakeTableOperationsVm
}

describe('useTableOperations', () => {
  describe('when in editable mode', () => {
    it('should initialize with empty row if no initial data', async () => {
      const mockCreateEmptyRow = vi.fn(createEmptyRow)
      const wrapper = mountTableOperations({
        createEmptyRow: mockCreateEmptyRow,
      })

      await nextTick()

      const vm = getVm(wrapper)
      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toHaveLength(1)
      expect(rows[0]).toEqual({ name: '', amount: 0 })
      expect(mockCreateEmptyRow).toHaveBeenCalled()
    })

    it('should initialize with provided initial data', () => {
      const fakeInitialData = [{ name: 'Item 1', amount: 100 }]
      const wrapper = mountTableOperations({
        initialData: fakeInitialData,
      })

      const vm = getVm(wrapper)
      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toEqual(fakeInitialData)
    })

    it('should auto-add empty row when array becomes empty', async () => {
      const wrapper = mountTableOperations({
        initialData: [{ name: 'Item 1', amount: 100 }],
      })

      const vm = getVm(wrapper)
      if (vm.rows && typeof vm.rows === 'object' && 'value' in vm.rows) {
        vm.rows.value = []
      } else {
        vm.rows = []
      }
      await nextTick()

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toHaveLength(1)
      expect(rows[0]).toEqual({ name: '', amount: 0 })
    })
  })

  describe('when in view mode', () => {
    it('should not auto-add rows when empty', async () => {
      const wrapper = mountTableOperations({
        mode: 'view',
        initialData: [],
      })

      await nextTick()

      const vm = getVm(wrapper)
      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toHaveLength(0)
    })
  })

  describe('when adding rows', () => {
    it('should add empty row to array', () => {
      const wrapper = mountTableOperations({
        initialData: [{ name: 'Item 1', amount: 100 }],
      })

      const vm = getVm(wrapper)
      vm.addRow()

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toHaveLength(2)
      expect(rows[1]).toEqual({ name: '', amount: 0 })
    })

    it('should add row with template values', () => {
      const wrapper = mountTableOperations({
        initialData: [],
        createEmptyRow: () => ({ name: '', amount: 0, category: '' }),
      })

      const vm = getVm(wrapper)
      vm.addRow({ name: 'Prefilled', category: 'Food' })

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows[rows.length - 1]).toEqual({
        name: 'Prefilled',
        amount: 0,
        category: 'Food',
      })
    })
  })

  describe('when deleting rows', () => {
    it('should remove row from array', async () => {
      const wrapper = mountTableOperations({
        initialData: [
          { name: 'Item 1', amount: 100 },
          { name: 'Item 2', amount: 200 },
        ],
      })

      const vm = getVm(wrapper)
      await vm.deleteRow(0)

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toHaveLength(1)
      expect(rows[0].name).toBe('Item 2')
    })

    it('should call onDelete callback if provided', async () => {
      const mockOnDelete = vi.fn().mockResolvedValue(undefined)
      const fakeItem = { id: '123', name: 'Item 1', amount: 100 }
      const wrapper = mountTableOperations({
        initialData: [fakeItem],
        onDelete: mockOnDelete,
      })

      const vm = getVm(wrapper)
      await vm.deleteRow(0)

      expect(mockOnDelete).toHaveBeenCalledWith(fakeItem, 0)
    })
  })

  describe('when updating cells', () => {
    it('should update cell value directly in editable mode without onUpdate', async () => {
      const wrapper = mountTableOperations({
        initialData: [{ name: 'Old Name', amount: 100 }],
      })

      const vm = getVm(wrapper)
      await vm.updateCell(0, 'name', 'New Name')

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows[0].name).toBe('New Name')
    })

    it('should call onUpdate callback if provided', async () => {
      const mockOnUpdate = vi.fn().mockResolvedValue({ name: 'Updated', amount: 150 })
      const wrapper = mountTableOperations({
        initialData: [{ name: 'Old', amount: 100 }],
        onUpdate: mockOnUpdate,
      })

      const vm = getVm(wrapper)
      await vm.updateCell(0, 'name', 'New Name')

      expect(mockOnUpdate).toHaveBeenCalledWith({ name: 'Old', amount: 100 }, 'name', 'New Name')
      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows[0]).toEqual({ name: 'Updated', amount: 150 })
    })

    it('should not call onUpdate if value unchanged', async () => {
      const mockOnUpdate = vi.fn()
      const wrapper = mountTableOperations({
        initialData: [{ name: 'Same', amount: 100 }],
        onUpdate: mockOnUpdate,
      })

      const vm = getVm(wrapper)
      await vm.updateCell(0, 'name', 'Same')

      expect(mockOnUpdate).not.toHaveBeenCalled()
    })
  })

  describe('when saving all rows', () => {
    it('should call onSave with all rows', async () => {
      const mockOnSave = vi.fn().mockResolvedValue({})
      const fakeData = [
        { name: 'Item 1', amount: 100 },
        { name: 'Item 2', amount: 200 },
      ]
      const wrapper = mountTableOperations({
        initialData: fakeData,
        onSave: mockOnSave,
      })

      const vm = getVm(wrapper)
      await vm.saveAll()

      expect(mockOnSave).toHaveBeenCalledWith(fakeData)
    })

    it('should validate before saving', async () => {
      const mockValidate = vi.fn().mockReturnValue([0])
      const mockOnSave = vi.fn().mockResolvedValue({})
      const wrapper = mountTableOperations({
        initialData: [{ name: '', amount: 100 }],
        onSave: mockOnSave,
        validate: mockValidate,
      })

      const vm = getVm(wrapper)
      await expect(vm.saveAll()).rejects.toThrow('Validation errors')

      expect(mockValidate).toHaveBeenCalled()
      const validationErrors = readMaybeRef<number[]>(vm.validationErrors)
      expect(validationErrors).toEqual([0])
      expect(mockOnSave).not.toHaveBeenCalled()
    })

    it('should reset to empty row on successful save', async () => {
      const mockOnSave = vi.fn().mockResolvedValue({})
      const wrapper = mountTableOperations({
        initialData: [{ name: 'Item', amount: 100 }],
        onSave: mockOnSave,
      })

      const vm = getVm(wrapper)
      await vm.saveAll()

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toHaveLength(1)
      expect(rows[0]).toEqual({ name: '', amount: 0 })
    })

    it('should handle failed items', async () => {
      const failedItem = { name: 'Failed', amount: 50 }
      const mockOnSave = vi.fn().mockResolvedValue({ failedItems: [failedItem] })
      const wrapper = mountTableOperations({
        initialData: [
          { name: 'Item 1', amount: 100 },
          { name: 'Failed', amount: 50 },
        ],
        onSave: mockOnSave,
      })

      const vm = getVm(wrapper)
      await vm.saveAll()

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toEqual([failedItem])
    })

    it('should set loading state during save', async () => {
      vi.useFakeTimers()
      let resolvePromise: ((value: { failedItems?: FakeRow[] }) => void) | undefined
      const mockOnSave = vi.fn(
        () =>
          new Promise<{ failedItems?: FakeRow[] }>((resolve) => {
            resolvePromise = resolve
          }),
      )

      const wrapper = mountTableOperations({
        initialData: [{ name: 'Item', amount: 100 }],
        onSave: mockOnSave,
      })

      const vm = getVm(wrapper)
      const savePromise = vm.saveAll()
      await nextTick()

      const isLoadingDuringSave = readMaybeRef<boolean>(vm.isLoading)
      expect(isLoadingDuringSave).toBe(true)

      resolvePromise?.({})
      await savePromise
      await vi.advanceTimersByTimeAsync(1000)

      const isLoadingAfterSave = readMaybeRef<boolean>(vm.isLoading)
      expect(isLoadingAfterSave).toBe(false)
      vi.useRealTimers()
    })
  })

  describe('when validating rows', () => {
    it('should call validate function and return error indexes', () => {
      const mockValidate = vi.fn().mockReturnValue([1, 3])
      const wrapper = mountTableOperations({
        initialData: [{ name: 'Item 1' }, { name: '' }, { name: 'Item 3' }, { name: '' }],
        createEmptyRow: () => ({ name: '' }),
        validate: mockValidate,
      })

      const vm = getVm(wrapper)
      const result = vm.validateRows()

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(mockValidate).toHaveBeenCalledWith(rows)
      expect(result).toEqual([1, 3])
      const validationErrors = readMaybeRef<number[]>(vm.validationErrors)
      expect(validationErrors).toEqual([1, 3])
    })
  })

  describe('when clearing all rows', () => {
    it('should reset to single empty row', () => {
      const wrapper = mountTableOperations({
        initialData: [
          { name: 'Item 1', amount: 100 },
          { name: 'Item 2', amount: 200 },
        ],
      })

      const vm = getVm(wrapper)
      vm.clearAll()

      const rows = readMaybeRef<FakeRow[]>(vm.rows)
      expect(rows).toHaveLength(1)
      expect(rows[0]).toEqual({ name: '', amount: 0 })
    })

    it('should clear validation errors', () => {
      const wrapper = mountTableOperations({
        initialData: [{ name: '' }],
        createEmptyRow: () => ({ name: '' }),
        validate: () => [0],
      })

      const vm = getVm(wrapper)
      vm.validateRows()

      const validationErrors = readMaybeRef<number[]>(vm.validationErrors)
      expect(validationErrors).toEqual([0])

      vm.clearAll()

      const clearedValidationErrors = readMaybeRef<number[]>(vm.validationErrors)
      expect(clearedValidationErrors).toEqual([])
    })
  })
})
