<script lang="ts" setup>
import type { ExpenseSubCategorySummary, ExpenseSummaryListItem } from '@/types/dataSummary'
import { DateFormat, formatDate } from '@/helpers/date/formatDate'
import { ref } from 'vue'

const UNCATEGORIZED_GROUP_KEY = 'uncategorized-group'
const UNCATEGORIZED_GROUP_NAME = 'No SubCategory'
const SUBCATEGORY_INDENT_PX = 30
const EXPENSE_INDENT_PX = 60
const EXPAND_ICON_MARGIN_RIGHT_PX = 20
const EMPTY_COLUMN_VALUE = '-'
const OPENING_PARENTHESES = '('
const CLOSING_PARENTHESES_WITH_SPACE = ') '
const ROUNDING_FACTOR = 100

const { summaryForSelectedMonthBySubcategory, uncategorizedExpenses } = defineProps<{
  summaryForSelectedMonthBySubcategory: ExpenseSubCategorySummary[]
  uncategorizedExpenses: ExpenseSummaryListItem[]
}>()

const expandedRows = ref<string[]>([])

function isExpanded(key: string) {
  return expandedRows.value.includes(key)
}

function toggleExpanded(key: string) {
  if (isExpanded(key)) {
    expandedRows.value = expandedRows.value.filter((activeKey) => activeKey !== key)
    return
  }

  expandedRows.value = [...expandedRows.value, key]
}

function toggleExpandedIfAllowed(key: string, isExpandable: boolean) {
  if (!isExpandable) {
    return
  }

  toggleExpanded(key)
}

function formatExpenseDate(date: string) {
  return formatDate(date, DateFormat.YYYY_MM_DD, { ignoreTimezone: true })
}

function getUncategorizedTotal() {
  const uncategorizedTotal = uncategorizedExpenses.reduce(
    (sum, expense) => sum + expense.netAmount,
    0,
  )
  return Math.round(uncategorizedTotal * ROUNDING_FACTOR) / ROUNDING_FACTOR
}
</script>

<template>
  <template
    v-for="subcategoryDetails in summaryForSelectedMonthBySubcategory"
    :key="subcategoryDetails.id"
  >
    <tr
      data-testid="subcategory-summary-row"
      class="border border-gray-400 text-sm hover:bg-gray-100"
    >
      <td
        class="subcategory-name p-2"
        :class="{ expandable: subcategoryDetails.expenses.length > 0 }"
        :style="{ paddingLeft: `${SUBCATEGORY_INDENT_PX}px` }"
        @click="
          toggleExpandedIfAllowed(subcategoryDetails.id, subcategoryDetails.expenses.length > 0)
        "
      >
        {{ subcategoryDetails.name }}
        <span class="expand-icon" :style="{ marginRight: `${EXPAND_ICON_MARGIN_RIGHT_PX}px` }"
          ><span v-if="isExpanded(subcategoryDetails.id)">▼</span
          ><span v-else-if="subcategoryDetails.expenses.length > 0">▶</span></span
        >
      </td>
      <td class="p-2 text-center">{{ subcategoryDetails.total }}</td>
      <td class="p-2 text-center">{{ subcategoryDetails.threeMonthAvg }}</td>
      <td class="p-2 text-center">{{ subcategoryDetails.diffTotalToAvg }}</td>
      <td class="p-2 text-center">{{ subcategoryDetails.diffTotalToAvgAsPercent }}</td>
    </tr>
    <tr
      v-for="expense in subcategoryDetails.expenses"
      v-show="isExpanded(subcategoryDetails.id)"
      :key="expense.id"
      data-testid="expense-detail-row"
      class="border border-gray-200 text-sm"
    >
      <td class="expense-name p-2" :style="{ paddingLeft: `${EXPENSE_INDENT_PX}px` }">
        {{ OPENING_PARENTHESES }}{{ formatExpenseDate(expense.date)
        }}{{ CLOSING_PARENTHESES_WITH_SPACE }}{{ expense.name }}
      </td>
      <td class="p-2 text-center">{{ expense.netAmount }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
    </tr>
  </template>

  <template v-if="uncategorizedExpenses.length > 0">
    <tr
      data-testid="uncategorized-group-row"
      class="border border-gray-400 text-sm hover:bg-gray-100"
    >
      <td
        class="subcategory-name expandable p-2"
        :style="{ paddingLeft: `${SUBCATEGORY_INDENT_PX}px` }"
        @click="toggleExpanded(UNCATEGORIZED_GROUP_KEY)"
      >
        {{ UNCATEGORIZED_GROUP_NAME }}
        <span class="expand-icon" :style="{ marginRight: `${EXPAND_ICON_MARGIN_RIGHT_PX}px` }"
          ><span v-if="isExpanded(UNCATEGORIZED_GROUP_KEY)">▼</span><span v-else>▶</span></span
        >
      </td>
      <td class="p-2 text-center">{{ getUncategorizedTotal() }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
    </tr>
    <tr
      v-for="expense in uncategorizedExpenses"
      v-show="isExpanded(UNCATEGORIZED_GROUP_KEY)"
      :key="expense.id"
      data-testid="expense-detail-row"
      class="border border-gray-200 text-sm"
    >
      <td class="expense-name p-2" :style="{ paddingLeft: `${EXPENSE_INDENT_PX}px` }">
        {{ OPENING_PARENTHESES }}{{ formatExpenseDate(expense.date)
        }}{{ CLOSING_PARENTHESES_WITH_SPACE }}{{ expense.name }}
      </td>
      <td class="p-2 text-center">{{ expense.netAmount }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
      <td class="p-2 text-center">{{ EMPTY_COLUMN_VALUE }}</td>
    </tr>
  </template>
</template>

<style scoped>
.expandable {
  cursor: pointer;
}

.expand-icon {
  float: right;
}
</style>
