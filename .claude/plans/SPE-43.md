# Plan: SPE-43 — Add Category/Subcategory creation from dropdown

## Analysis

**Dropdown stack today:** `GenericTable.vue` → `TableRow.vue` → `TableCell.vue` renders a
`DropdownWithInput.vue` for `column.type === 'dropdown'` (options via `column.dropdownOptions`,
static array or `(row) => string[]`). `DropdownWithInput.vue` wraps `Select.vue`, which owns
open/close state (`isOptionsVisible`) and teleports a plain `DropdownOptions.vue` list to
`<body>`, positioned via `useDropdownPosition`. Clicking an option (`@mousedown.stop` in
`DropdownOptions.vue`) emits `dropdownOptionClick` → bubbles up as `onChange` → `TableCell.vue`'s
`handleDropdownChange` sets `localValue` and immediately emits `cell:changed`. None of these
components currently have search input or a "create new" affordance.

There is an **unused** helper, `DropdownWithInput/useDropdownOptionHandlers.ts`, that already
implements case-insensitive substring filtering (`filterListBasedOnInput`) and
open/close (`showCategoryOptions`/`hideCategoryOptions`) state — no current component imports it.
It's a natural starting point for the search box logic rather than writing filtering from
scratch, though its API will need adjusting to fit the new component boundary described below.

**Category/Subcategory creation already exists** as a full vertical slice, just not wired into
the table dropdown: `ManageCategories/hooks/useAddCategory.ts` and `useAddSubCategory.ts` call
`service/categories/addNewCategories.ts` / `addNewSubCategory.ts` (which hit the backend via
`gateway/expenseCategory/createExpenseCategory.ts` / `gateway/expenseSubCategory/createExpenseSubCategory.ts`),
then push the created object into the reactive store via `getStore().addCategory(...)` /
`getStore().addSubCategory(categoryId, ...)`. This is the logic to reuse — no new
service/gateway/backend code should be needed, only new call sites.

**Where `category`/`subCategory` dropdown columns are declared:** `ExpenseDataTable.vue` (and by
the same pattern, `IncomeDataTable.vue`, `AddExpenseTable.vue`, `AddIncomeTable.vue`) build
`ColumnConfig[]` with `type: 'dropdown'` for `category` and `subCategory`, sourcing options from
`useCategoriesInExpenseData()` (`categoryNames`, `getCategory`, `getSubcategories`). Subcategory
options depend on the row's selected category and the column is `disabled` until a category is
picked — the "create subcategory" affordance therefore needs the row's current category, not just
free text.

### Recommendation: callback prop, not an emitted event

Use a **callback prop** on `ColumnConfig` (e.g. `onCreateOption?: (searchText: string, row: T) => Promise<string | undefined>`)
rather than a DOM event emitted up through `TableCell` → `TableRow` → `GenericTable`.

Reasons:
- **Locality of return value.** Creating a category is async and the result (the newly created
  option's name, or failure) needs to flow *back down* into the same cell to select it and close
  the dropdown. An emitted event is fire-and-forget upward; getting a result back down would
  require the parent to re-look-up the row/column and push a value back through props/`v-model`,
  which is exactly the round-trip `cell:changed` already does for normal edits — reusing a
  callback avoids inventing a second, parallel "response" channel.
- **Per-column, not per-table.** `ColumnConfig` is already the mechanism for per-column behavior
  (`format`, `calculate`, `disabled`, `dropdownOptions` are all functions on `ColumnConfig`). A
  callback fits that existing shape; an event would have to be namespaced by column key
  (`@create-option="(key, row, text) => ..."`) to disambiguate `category` vs `subCategory` in the
  same table, adding a routing layer for no benefit since there's only ever one handler per column
  anyway.
- **Type safety.** A callback prop is typed end-to-end (`(searchText: string, row: T) => Promise<string | undefined>`);
  a generic `emit('cell:create-option', ...)` payload would need runtime narrowing at the call
  site.
- The existing `cell:changed` emit stays as-is — it's genuinely a "something changed, tell the
  parent" notification with no return value expected, which is the right shape for an event.
  Creation is different because it's a request/response.

### API shape for "advanced" (search + create) vs "simple" dropdown mode

Add two new optional fields to `ColumnConfig<T>` (`types.ts`):

```ts
export interface ColumnConfig<T extends TableRowData = TableRowData> {
  // ...existing fields...
  dropdownSearchable?: boolean
  onCreateOption?: (searchText: string, row: T) => Promise<string | undefined | void>
}
```

- `dropdownSearchable` (default `false`/undefined = "simple" list, current behavior unchanged)
  toggles rendering of the search input at the top of the options panel.
- `onCreateOption` presence toggles rendering of the "Create '<text>'" button at the bottom of the
  options panel, **but only when `dropdownSearchable` is also `true`**. Search-without-create is a
  valid combination (search text just filters); create-without-search is not, since there'd be no
  text to create from — if `onCreateOption` is set but `dropdownSearchable` is falsy, the create
  button is not rendered at all (treated as a misconfiguration, not silently upgraded). In practice
  `ExpenseDataTable.vue`/`IncomeDataTable.vue` will set both together for `category`/`subCategory`
  columns. The callback returns the name to select (so the dropdown can update `localValue` and
  emit `cell:changed`), or `undefined`/throws on failure (dropdown stays open, an inline error is
  shown, no selection change).
- The create button is **disabled** whenever the current search text exactly matches an existing
  option (case-insensitive), since creating a duplicate isn't allowed — the button becomes
  effectively another way to select that existing option, but the safer, minimal behavior is just
  to disable it rather than repurpose its click handler.

This mirrors the existing `dropdownOptions?: string[] | ((row: T) => string[])` pattern of putting
all dropdown behavior on `ColumnConfig`, keeps `GenericTable.vue`'s own prop surface untouched, and
requires no new events on `GenericTable`/`TableRow` (they already pass `column` through unchanged).

## Checklist

- [x] Step 1: Add `dropdownSearchable?: boolean` and
      `onCreateOption?: (searchText: string, row: T) => Promise<string | undefined | void>` to
      `ColumnConfig<T>` in `packages/frontend/src/components/DesignSystem/Table/types.ts`.

- [x] Step 2: Extend `DropdownOptions.vue` (`packages/frontend/src/components/DropdownWithInput/DropdownOptions.vue`)
      to optionally render:
      - a search `<input>` above the options list (visible when a new `searchable` prop is true),
        filtering the rendered `options` by case-insensitive substring match (reuse the filtering
        logic from `useDropdownOptionHandlers.ts`, adapted to live inside this component or a
        small composable it calls).
      - a "Create '<searchText>'" button pinned to the bottom of the panel, visible only when
        `searchable` is true **and** an `onCreate` prop/callback is provided (create requires
        search — if `onCreate` is set without `searchable`, render nothing). Disabled while the
        search text is empty, while it exactly matches an existing option (case-insensitive — no
        duplicate creation), or while a creation request is in flight; shows a loading/error state.
      Keep the panel's existing `Teleport`/positioning/`max-h-[200px] overflow-y-auto` container
      from `Select.vue` unchanged; the search input and create button live inside that same
      teleported panel (search pinned top, list scrolls, create button pinned bottom).

- [x] Step 3: Update `Select.vue` (`packages/frontend/src/components/DropdownWithInput/Select.vue`)
      to accept and forward new props `searchable?: boolean` and
      `onCreateOption?: (searchText: string) => Promise<string | undefined | void>` to
      `DropdownOptions.vue`, and to handle the create flow: on create-button click, call
      `onCreateOption`, and on success set the returned value as the selection (same path as
      `handleDropdownOptionsClick`) and close the panel; on failure keep the panel open and surface
      the error.

- [x] Step 4: Update `DropdownWithInput.vue`
      (`packages/frontend/src/components/DropdownWithInput/DropdownWithInput.vue`) to accept
      `searchable?: boolean` and `onCreateOption?: (...)` props and pass them through to `Select`.

- [x] Step 5: Update `TableCell.vue`
      (`packages/frontend/src/components/DesignSystem/Table/TableCell.vue`) to pass
      `:searchable="column.dropdownSearchable"` and an `:on-create-option` binding
      `column.onCreateOption ? (text) => column.onCreateOption!(text, row) : undefined` to
      `DropdownWithInput`, and on a successful create result, set `localValue` and call
      `emitCellChanged()` (mirroring `handleDropdownChange`).

- [x] Step 6: Wire up `ExpenseDataTable.vue`
      (`packages/frontend/src/components/ExpenseDataTable/ExpenseDataTable.vue`): add
      `dropdownSearchable: true` and `onCreateOption` to the `category` column (calling
      `addNewCategory` + `getStore().addCategory`, reusing the logic in
      `ManageCategories/hooks/useAddCategory.ts` — either by calling that hook's underlying
      service/store calls directly, or by extracting a small non-hook helper function both call
      sites can share) and to the `subCategory` column (calling `addNewSubcategory(category.id, ...)`
      + `getStore().addSubCategory`, same reuse approach as `useAddSubCategory.ts`, guarding for
      the case where `row.category` isn't set yet).

- [x] Step 7: Repeat step 6 for `IncomeDataTable.vue`, `AddExpenseTable.vue`, `AddIncomeTable.vue`
      wherever they declare `category`/`subCategory` dropdown columns, for consistency (confirm
      exact columns during implementation — noted as likely candidates from the codebase
      exploration but not yet fully inspected).
      Result: `IncomeDataTable.vue` and `AddIncomeTable.vue` have no category/subCategory
      dropdown columns (income rows are date/name/amount only) — nothing to change there.
      `AddExpenseTable.vue` does declare `category`/`subCategory` dropdown columns and was
      updated the same way as `ExpenseDataTable.vue`.

- [x] Step 8: Unit tests — `DropdownOptions.test.ts`
      (`packages/frontend/src/components/DropdownWithInput/__tests__/DropdownOptions.test.ts`):
      add cases for (a) search input filters visible options by substring, (b) create button
      renders only when both `searchable` is true and `onCreate` is passed, (c) create button does
      NOT render when `onCreate` is passed but `searchable` is false/undefined, (d) create button
      shows current search text, (e) create button is disabled when search text exactly matches an
      existing option (case-insensitive), (f) clicking create invokes the callback and shows
      loading/error states.

- [x] Step 9: Unit tests — `DropdownWithInput.test.ts`
      (`packages/frontend/src/components/DropdownWithInput/__tests__/DropdownWithInput.test.ts`):
      add cases verifying `searchable`/`onCreateOption` props are forwarded to `Select`, and that a
      successful create result updates the model value and emits `onChange`.

- [x] Step 10: Unit tests — `TableCell.test.ts`
      (`packages/frontend/src/components/DesignSystem/Table/__tests__/TableCell.test.ts`): extend
      the existing "dropdown" describe block with cases for `column.dropdownSearchable` and
      `column.onCreateOption` being passed through to `DropdownWithInput`, and for a create-flow
      result triggering `cell:changed`.

- [ ] Step 11: Unit tests — add/extend a test for `ExpenseDataTable.vue`'s category/subCategory
      `onCreateOption` handlers (new categories append to the store and select the new value on
      the row; new subcategories are scoped to the row's current category). Follow existing
      colocated `__tests__` conventions and mock `service/categories/addNewCategories.ts` /
      `addNewSubCategory.ts` + the store the way `ManageCategories/__tests__/` tests already do.

- [ ] Step 12: Run the full frontend unit test suite (`vitest`) and confirm all new and existing
      tests pass, with no behavior change for columns that don't set `dropdownSearchable`/
      `onCreateOption` (simple mode stays pixel-for-pixel identical to today).
