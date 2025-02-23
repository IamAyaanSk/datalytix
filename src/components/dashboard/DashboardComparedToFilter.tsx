'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useEffect, useCallback, useMemo, useRef, useState } from 'react'
import { DateTime } from 'luxon'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { DatePicker } from '@/components/dashboard/DatePicker'
import qs from 'qs'
import { useDebounce } from '@uidotdev/usehooks'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { getIstStringFromDate } from '@/lib/utils'
import { MAXIMUM_PREVIOUS_DATA_LOOKUP_ALLOWED_IN_MONTHS } from '@/constants/global'

type TComparedToFilterPresets = {
  previousMonth: number | null
  previousWeek: number | null
  yesterday: number | null
}

export function DashboardComparedToFilter() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const loadingToastId = useRef<number | string | null>(null)

  const queryParamSelectedDateTimeStamp = searchParams.get('startDate')
  const initialSelectedDate = queryParamSelectedDateTimeStamp
    ? new Date(parseInt(queryParamSelectedDateTimeStamp))
    : new Date()

  const [queryParamSelectedDate, setQueryParamSelectedDate] = useState<Date>(initialSelectedDate)

  const comparedToPresets: TComparedToFilterPresets = useMemo(() => {
    const selectedDate = DateTime.fromJSDate(queryParamSelectedDate, {
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
  }, [queryParamSelectedDate])

  const queryParamComparedDateTimeStamp = searchParams.get('compareStartDate')
  const defaultCompareDate = queryParamComparedDateTimeStamp
    ? new Date(parseInt(queryParamComparedDateTimeStamp))
    : new Date()

  const [queryParamComparedDate, setQueryParamComparedDate] = useState<Date>(defaultCompareDate)

  const [selectedCompareOption, setSelectedCompareOption] = useState<
    'previousMonth' | 'previousWeek' | 'yesterday' | 'custom'
  >('previousMonth')

  useEffect(() => {
    const ms = DateTime.fromJSDate(queryParamComparedDate, {
      zone: 'Asia/Kolkata'
    }).toMillis()

    if (comparedToPresets.yesterday === ms) {
      setSelectedCompareOption('yesterday')
    } else if (comparedToPresets.previousWeek === ms) {
      setSelectedCompareOption('previousWeek')
    } else if (comparedToPresets.previousMonth === ms) {
      setSelectedCompareOption('previousMonth')
    } else {
      setSelectedCompareOption('custom')
    }
  }, [queryParamComparedDate, comparedToPresets])

  const [queryParams, setQueryParamsState] = useState<string | null>(null)

  const setQueryParams = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const currentParams = Object.fromEntries(searchParams.entries())
      const mergedParams = { ...currentParams, ...params }

      for (const key in mergedParams) {
        if (!mergedParams[key]) {
          delete mergedParams[key]
        }
      }

      const newSearchParams = qs.stringify(mergedParams, {
        arrayFormat: 'brackets'
      })

      const currentSearchParams = qs.stringify(currentParams, {
        arrayFormat: 'brackets'
      })

      if (newSearchParams !== currentSearchParams) {
        setQueryParamsState(newSearchParams)
      }
    },
    [searchParams]
  )

  const debouncedQueryParams = useDebounce(queryParams, 850)

  useEffect(() => {
    if (debouncedQueryParams) {
      startTransition(() => {
        router.replace(`${pathname}?${debouncedQueryParams}`)
      })
    }
  }, [debouncedQueryParams, pathname, router])

  useEffect(() => {
    if (isPending) {
      if (!loadingToastId.current) {
        loadingToastId.current = toast.loading('Fetching data', {
          closeButton: false
        })
      }
    } else {
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current)
        loadingToastId.current = null
      }
    }

    return () => {
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current)
        loadingToastId.current = null
      }
    }
  }, [isPending])

  useEffect(() => {
    const startDateTimeStamp = DateTime.fromJSDate(queryParamSelectedDate, {
      zone: 'Asia/Kolkata'
    })
      .startOf('day')
      .toUTC()
      .toMillis()

    const endDateTimeStamp = DateTime.fromJSDate(queryParamSelectedDate, {
      zone: 'Asia/Kolkata'
    })
      .endOf('day')
      .toUTC()
      .toMillis()

    const compareToStartDateTimeStamp = DateTime.fromJSDate(queryParamComparedDate, {
      zone: 'Asia/Kolkata'
    })
      .startOf('day')
      .toUTC()
      .toMillis()

    const compareToEndDateTimeStamp = DateTime.fromJSDate(queryParamComparedDate, {
      zone: 'Asia/Kolkata'
    })
      .endOf('day')
      .toUTC()
      .toMillis()

    setQueryParams({
      startDate: startDateTimeStamp.toString(),
      endDate: endDateTimeStamp.toString(),
      compareStartDate: compareToStartDateTimeStamp.toString(),
      compareEndDate: compareToEndDateTimeStamp.toString()
    })
  }, [queryParamSelectedDate, queryParamComparedDate, setQueryParams])

  const handleSetCompareDate = (timestamp: number) => {
    setQueryParamComparedDate(new Date(timestamp))
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <DatePicker
        queryParamDate={queryParamSelectedDate}
        setQueryParamDate={setQueryParamSelectedDate}
        isPending={isPending}
        queryParamName="startDate"
        pickerTriggerClassname="h-8"
      />
      <p className="text-sm font-medium text-primary/80">compared to</p>
      <div className="flex flex-row items-center justify-center rounded-lg border border-primary">
        <DatePicker
          queryParamDate={queryParamComparedDate}
          setQueryParamDate={setQueryParamComparedDate}
          isPending={isPending}
          queryParamName="compareStartDate"
        >
          <Button id="date" className={`font-normal p-2 h-8 rounded-r-none`} disabled={isPending}>
            <CalendarIcon className="text-white mr-2 h-4 w-4" />
            {selectedCompareOption === 'custom' && (
              <span className="text-white pr-4">{getIstStringFromDate(queryParamComparedDate)}</span>
            )}
          </Button>
        </DatePicker>
        <Select
          value={selectedCompareOption}
          onValueChange={(e) => handleSetCompareDate(comparedToPresets[e as keyof TComparedToFilterPresets]!)}
        >
          <SelectTrigger className="bg-white ring-offset-0 rounded-l-none h-8" disabled={isPending}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {comparedToPresets.yesterday && (
                <SelectItem className="group/select-item" value="yesterday">
                  Yesterday{' '}
                  <span className="text-gray-600 group-hover/select-item:text-gray-200 group-focus/select-item:text-gray-200">
                    ({getIstStringFromDate(new Date(comparedToPresets.yesterday))})
                  </span>
                </SelectItem>
              )}

              {comparedToPresets.previousWeek && (
                <SelectItem className="group/select-item" value="previousWeek">
                  Last week{' '}
                  <span className="text-gray-600 group-hover/select-item:text-gray-200 group-focus/select-item:text-gray-200">
                    ({getIstStringFromDate(new Date(comparedToPresets.previousWeek))})
                  </span>
                </SelectItem>
              )}

              {comparedToPresets.previousMonth && (
                <SelectItem className="group/select-item" value="previousMonth">
                  Last month{' '}
                  <span className="text-gray-600 group-hover/select-item:text-gray-200 group-focus/select-item:text-gray-200">
                    ({getIstStringFromDate(new Date(comparedToPresets.previousMonth))})
                  </span>
                </SelectItem>
              )}

              {Object.values(comparedToPresets).every((v) => !v) && (
                <p className="p-4 text-sm font-medium">No possible presets available.</p>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
