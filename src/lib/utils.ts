import { MAXIMUM_PREVIOUS_DATA_LOOKUP_ALLOWED_IN_MONTHS } from '@/constants/global'
import { clsx, type ClassValue } from 'clsx'
import { DateTime } from 'luxon'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formattedNumber(value: number) {
  return new Intl.NumberFormat('en-IN').format(Math.ceil(value))
}

export function formattedMoney(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(value)
}

export const getIstStringFromDate = (date: Date) => {
  return DateTime.fromJSDate(date, {
    zone: 'Asia/Kolkata'
  }).toLocaleString(DateTime.DATE_MED)
}

export function getCompareToFilterPresets(date: Date) {
  const selectedDate = DateTime.fromJSDate(date, {
    zone: 'Asia/Kolkata'
  }).startOf('day')

  const previousMonth = selectedDate.minus({ months: 1 }).startOf('day').toMillis()
  const previousWeek = selectedDate.minus({ weeks: 1 }).startOf('day').toMillis()
  const yesterday = selectedDate.minus({ days: 1 }).startOf('day').toMillis()
  const maxPreviousDataLookupDate = DateTime.fromJSDate(new Date(), {
    zone: 'Asia/Kolkata'
  })
    .minus({ months: MAXIMUM_PREVIOUS_DATA_LOOKUP_ALLOWED_IN_MONTHS })
    .startOf('day')
    .toMillis()

  return {
    previousMonth: previousMonth >= maxPreviousDataLookupDate ? previousMonth : null,
    previousWeek: previousWeek >= maxPreviousDataLookupDate ? previousWeek : null,
    yesterday: yesterday >= maxPreviousDataLookupDate ? yesterday : null
  }
}
