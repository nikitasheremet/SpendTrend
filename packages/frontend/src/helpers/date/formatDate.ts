export enum DateFormat {
  YYYY_MM_DD = 'YYYY-MM-DD',
  DD_MMMM_YYYY = 'DD-MMMM-YYYY',
}

interface DateFormatOptions {
  ignoreTimezone?: boolean
}

function parseDate(date: Date | string | number, options?: DateFormatOptions): Date {
  if (options?.ignoreTimezone) {
    const isYYYY_MM_DDFormat = typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)
    if (isYYYY_MM_DDFormat) {
      const [year, month, day] = date.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
  }
  return new Date(date)
}

export function formatDate(
  date: Date | string | number,
  format: DateFormat,
  options?: DateFormatOptions,
): string {
  const dateObject = parseDate(date, options)
  switch (format) {
    case DateFormat.YYYY_MM_DD:
      return dateObject.toISOString().split('T')[0]
    case DateFormat.DD_MMMM_YYYY:
      return dateObject.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    default:
      return dateObject.toString()
  }
}
