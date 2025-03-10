export enum DateFormat {
  YYYY_MM_DD = 'YYYY-MM-DD',
}
export function formatDate(date: Date | string | number, format: DateFormat): string {
  const dateObject = new Date(date)

  switch (format) {
    case DateFormat.YYYY_MM_DD:
      return dateObject.toISOString().split('T')[0]
    default:
      return dateObject.toString()
  }
}
