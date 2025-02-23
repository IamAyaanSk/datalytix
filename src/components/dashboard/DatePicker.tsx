'use client'

import { Calendar as CalendarIcon } from 'lucide-react'
import { checkDateEquality, cn, getIstStringFromDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DateTime } from 'luxon'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { MAXIMUM_PREVIOUS_DATA_LOOKUP_ALLOWED_IN_MONTHS } from '@/constants/global'

type TDatePickerProps = {
  queryParamDate: Date
  setQueryParamDate: React.Dispatch<React.SetStateAction<Date>>
  isPending: boolean
  queryParamName: 'startDate' | 'compareStartDate'
  children?: React.ReactNode
  containerClassName?: string
  pickerTriggerClassname?: string
}

export function DatePicker({
  queryParamDate,
  setQueryParamDate,
  isPending,
  queryParamName,
  children,
  containerClassName,
  pickerTriggerClassname
}: TDatePickerProps) {
  const searchParams = useSearchParams()

  const queryParamTimeStamp = searchParams.get(queryParamName)
  const currQueryParamDate = queryParamTimeStamp ? new Date(parseInt(queryParamTimeStamp)) : new Date()

  const [date, setDate] = useState<Date>(currQueryParamDate)
  const [isOpen, setIsOpen] = useState(false)

  const today = DateTime.fromJSDate(new Date(), {
    zone: 'Asia/Kolkata'
  }).startOf('day')

  const maxPreviousDataLookupDate = today.minus({ months: MAXIMUM_PREVIOUS_DATA_LOOKUP_ALLOWED_IN_MONTHS })

  const handlePopoverChange = (open: boolean) => {
    if (!open && date) {
      setQueryParamDate(date)
    } else {
      setDate(queryParamDate)
    }
    setIsOpen(open)
  }

  return (
    <div className={cn('grid gap-2', containerClassName)}>
      <Popover open={isOpen} onOpenChange={handlePopoverChange}>
        <PopoverTrigger asChild>
          {children ? (
            children
          ) : (
            <Button
              id="date"
              className={cn(
                'w-[150px] justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                pickerTriggerClassname
              )}
              disabled={isPending}
            >
              <CalendarIcon className="text-white mr-2 h-4 w-4" />
              {date ? (
                <span className="text-white">{getIstStringFromDate(date)}</span>
              ) : (
                <span className="text-white">Pick a date</span>
              )}
            </Button>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="single"
            defaultMonth={date ?? undefined}
            selected={date ?? undefined}
            onSelect={(e) => setDate(e as Date)}
            toDate={today.toJSDate()}
            fromDate={maxPreviousDataLookupDate.toJSDate()}
            disabled={{
              before: maxPreviousDataLookupDate.toJSDate(),
              after: today.toJSDate()
            }}
          />
          <Button
            className="text-xs mx-2 h-8 mb-4"
            disabled={!date || checkDateEquality(date, queryParamDate)}
            onClick={() => {
              setQueryParamDate(date)
              setIsOpen(false)
            }}
          >
            Search
          </Button>
          <Button
            className="text-xs m-2 h-8 mb-4"
            variant="outline"
            disabled={checkDateEquality(date, queryParamDate)}
            onClick={() => setDate(queryParamDate)}
          >
            Reset
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
