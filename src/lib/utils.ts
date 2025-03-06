import { MAXIMUM_PREVIOUS_DATA_LOOKUP_ALLOWED_IN_MONTHS } from '@/constants/global'
import { DistributionChainEntities, TAuthorizationPermissionSatifactionCombination, UserRole } from '@/types/types'
import { clsx, type ClassValue } from 'clsx'
import { DateTime } from 'luxon'
import { DateRange } from 'react-day-picker'
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

export const checkDateEquality = (firstDate: Date | undefined, secondDate: Date | undefined) => {
  if (!firstDate || !secondDate) {
    return false
  }

  return DateTime.fromJSDate(firstDate).hasSame(DateTime.fromJSDate(secondDate), 'day')
}

export const getUtcTimestampsForSelectedDates = (selectedDates: DateRange) => {
  const dateRange = {
    from: selectedDates.from || new Date(),
    to: selectedDates.to || new Date()
  }

  const startOfDay = DateTime.fromJSDate(dateRange.from, {
    zone: 'Asia/Kolkata'
  })
    .startOf('day')
    .toUTC()

  const endOfDay = DateTime.fromJSDate(dateRange.to, { zone: 'Asia/Kolkata' }).endOf('day').toUTC()

  return {
    from: startOfDay.toMillis().toString(),
    to: endOfDay.toMillis().toString()
  }
}

export function requirePermissionCombination({
  distributionEntityType,
  userRole,
  acceptCombinations
}: {
  distributionEntityType?: DistributionChainEntities
  userRole?: UserRole
  acceptCombinations: TAuthorizationPermissionSatifactionCombination[]
}) {
  const userPermissionCombinations: TAuthorizationPermissionSatifactionCombination[] = []

  if (distributionEntityType) {
    userPermissionCombinations.push(`${distributionEntityType}:`)
  }

  if (userRole) {
    userPermissionCombinations.push(`:${userRole}`)
  }

  if (distributionEntityType && userRole) {
    userPermissionCombinations.push(`${distributionEntityType}:${userRole}`)
  }

  if (
    userPermissionCombinations.some((userPermissionCombination) =>
      acceptCombinations.includes(userPermissionCombination)
    )
  ) {
    return true
  }

  return false
}

export const getIstDateTimeFromDate = (date: Date) =>
  DateTime.fromJSDate(date, {
    zone: 'Asia/Kolkata'
  })

export function getCapitalCasedSlug(slug: string, splitter: string = '-') {
  return slug
    .split(splitter)
    .map((word, index) => {
      if (index === 0) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase()
      }

      return word.toLowerCase()
    })
    .join(' ')
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
