export enum DateFormat {
  YYYY_MM_DD = 'YYYY-MM-DD',
  DD_MMMM_YYYY = 'DD-MMMM-YYYY',
}
export function formatDate(date: Date | string | number, format: DateFormat): string {
  const dateObject = new Date(date)

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
