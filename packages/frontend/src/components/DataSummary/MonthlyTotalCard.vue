<script lang="ts" setup>
import { showNumberAsDollar } from '@/helpers/showNumberAsDollar'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  topAmount: number
  threeMonthAvg: number
  changeAmount: number
  changePercent: number
  isBetter: boolean
}>()

const isBetterStyling = computed(() => (props.isBetter ? 'border-green-600' : 'border-red-600'))
</script>
<template>
  <div
    class="flex flex-col p-4 border-3 rounded-md justify-center items-center gap-2 w-fit"
    :class="isBetterStyling"
  >
    <h2 class="text-xl">{{ title }}</h2>
    <p class="text-lg font-bold">{{ showNumberAsDollar(topAmount) }}</p>
    <h3>3 Month Avg</h3>
    <p class="text-gray-500 font-bold">{{ showNumberAsDollar(threeMonthAvg) }}</p>
    <div class="flex flex-row gap-3">
      <div class="flex-none flex flex-col items-center w-20 justify-center">
        <h4 class="text-sm">+/-</h4>
        <p class="text-gray-500">{{ showNumberAsDollar(changeAmount) }}</p>
      </div>
      <div class="flex-none flex flex-col items-center w-20 justify-center">
        <h4 class="text-sm">%</h4>
        <p class="text-gray-500">{{ changePercent }}</p>
      </div>
    </div>
  </div>
</template>
