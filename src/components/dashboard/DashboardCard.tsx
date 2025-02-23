'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Ban, TrendingDown, TrendingUp } from 'lucide-react'
import { cn, formattedMoney, formattedNumber, getCompareToFilterPresets, getIstStringFromDate } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { DateTime } from 'luxon'

type TDashboardCardProps = {
  title: string
  highlightMetric: number
  footerConfig:
    | {
        showSeparator: boolean
        className?: string
        data: {
          title: string
          value: number
          color: 'red' | 'green' | 'blue' | 'yellow' | 'purple'
        }[]
      }
    | false
  comparisonMetricConfig:
    | {
        percentage: number | null
        isNegative: boolean | null
        comparedTo: string
        compareData?: {
          title: string
          value: number
          color: 'red' | 'green' | 'blue' | 'yellow' | 'purple'
        }[]
      }
    | false
  highlightMetricColor?: 'red' | 'green' | 'blue' | 'yellow' | 'purple'
  className?: string
  isMoney?: boolean
}

const dashboardCardsTextColorClassesMap = {
  red: 'text-red-800',
  blue: 'text-blue-800',
  green: 'text-green-800',
  yellow: 'text-yellow-800',
  purple: 'text-purple-800'
}

export const DashboardCard = ({
  title,
  highlightMetric,
  highlightMetricColor,
  footerConfig = false,
  comparisonMetricConfig = false,
  className,
  isMoney = true
}: TDashboardCardProps) => {
  const searchParams = useSearchParams()
  const selectedDateQueryParam = searchParams.get('startDate')
  const compareDateQueryParam = searchParams.get('compareStartDate')

  const selectedDate = selectedDateQueryParam ? new Date(parseInt(selectedDateQueryParam)) : new Date()
  const compareDate = compareDateQueryParam ? new Date(parseInt(compareDateQueryParam)) : new Date()

  const compareToString = useMemo(() => {
    const compareToPresets = getCompareToFilterPresets(selectedDate)

    const ms = DateTime.fromJSDate(compareDate, {
      zone: 'Asia/Kolkata'
    }).toMillis()

    if (compareToPresets.yesterday === ms) {
      return 'yesterday'
    } else if (compareToPresets.previousWeek === ms) {
      return 'last week'
    } else if (compareToPresets.previousMonth === ms) {
      return 'last month'
    } else {
      return getIstStringFromDate(compareDate)
    }
  }, [selectedDateQueryParam, compareDateQueryParam])

  return (
    <Card
      className={cn(
        `flex flex-col justify-evenly min-w-[18rem] sm:min-w-[20rem] lg:min-w-[23rem] border shadow-md font-sans py-3 border-primary/60`,
        className
      )}
    >
      <CardHeader className="py-0">
        <CardTitle className="text-blue-800 text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-0 space-y-3">
        <h3
          className={cn(
            'text-2xl font-semibold',
            highlightMetricColor && dashboardCardsTextColorClassesMap[highlightMetricColor]
          )}
        >
          {isMoney ? formattedMoney(highlightMetric) : formattedNumber(highlightMetric)}
        </h3>
        {comparisonMetricConfig && (
          <>
            {comparisonMetricConfig.percentage === null ||
            comparisonMetricConfig.isNegative === null ||
            !comparisonMetricConfig.compareData ? (
              <div className="text-xs flex flex-row items-center">
                <p className="bg-gray-100 px-2 py-1 flex flex-row items-center gap-1 rounded-lg mr-2 font-medium">
                  <Ban size={16} strokeWidth={1.5} />
                  <span>No comparison data available</span>
                </p>
              </div>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-xs flex flex-row items-center hover:cursor-pointer">
                    <p
                      className={`px-2 py-1 rounded-lg mr-2 font-medium flex flex-row items-center gap-1 ${
                        comparisonMetricConfig.isNegative ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {comparisonMetricConfig.isNegative ? (
                        <TrendingDown size={16} strokeWidth={1.5} />
                      ) : (
                        <TrendingUp size={16} strokeWidth={1.5} />
                      )}
                      <span>{comparisonMetricConfig.percentage.toFixed(2)}%</span>
                    </p>
                    <p className="font-light text-gray-500">Compared to {compareToString}</p>
                  </TooltipTrigger>
                  <TooltipContent className="p-3 ">
                    <h3 className="font-semibold text-sm mb-1">Stats ( {compareToString} )</h3>
                    {comparisonMetricConfig.compareData.map((item) => (
                      <div
                        className={cn(`font-medium text-sm`, dashboardCardsTextColorClassesMap[item.color])}
                        key={item.title}
                      >
                        <span>{isMoney ? formattedMoney(item.value) : formattedNumber(item.value)}</span>
                        <span> ({item.title})</span>
                      </div>
                    ))}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </>
        )}
      </CardContent>
      {footerConfig && footerConfig.showSeparator && <Separator className="mt-3" />}

      {footerConfig && footerConfig.data && (
        <CardFooter className={cn('py-0 mt-3 grid grid-cols-2 gap-2', footerConfig.className)}>
          {footerConfig.data.map((item) => (
            <div className={cn(`text-xs font-medium`, dashboardCardsTextColorClassesMap[item.color])} key={item.title}>
              <span>{isMoney ? formattedMoney(item.value) : formattedNumber(item.value)}</span>
              <span> ({item.title})</span>
            </div>
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
