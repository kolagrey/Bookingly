import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'

export function convertToTimezone(
  date: Date | string,
  timezone: string
): Date {
  return utcToZonedTime(
    typeof date === 'string' ? new Date(date) : date,
    timezone
  )
}

export function formatInTimezone(
  date: Date | string,
  timezone: string,
  formatStr: string = 'PPpp'
): string {
  const zonedDate = convertToTimezone(date, timezone)
  return format(zonedDate, formatStr, { timeZone: timezone })
}

export function getCurrentTimezoneOffset(timezone: string): string {
  const now = new Date()
  const zonedDate = utcToZonedTime(now, timezone)
  const offset = format(zonedDate, 'xxxxx', { timeZone: timezone })
  return `UTC${offset}`
}