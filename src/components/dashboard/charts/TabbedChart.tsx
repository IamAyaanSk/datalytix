'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import React from 'react'
import * as RechartsPrimitive from 'recharts'
import { cn } from '@/lib/utils'
import { DashboardComponentEmptyState } from '@/components/dashboard/DashboardComponentEmptyState'

type TTabbedineChartProps<T> = {
  title: string
  description?: string
  chartConfig: ChartConfig
  chartTabsConfig: T[]
  setSelectedTab: React.Dispatch<React.SetStateAction<T>>
  selectedTab: T
  isChartDataEmpty: boolean
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
  chartContainerClassName?: string
  chartCardClassName?: string
}

export function TabbedChart<T extends string>({
  title,
  description,
  chartConfig,
  children,
  chartTabsConfig,
  setSelectedTab,
  isChartDataEmpty,
  selectedTab,
  chartContainerClassName,
  chartCardClassName
}: TTabbedineChartProps<T>) {
  return (
    <Card className={cn('border border-primary/60', chartCardClassName)}>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-blue-800 text-lg font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {!isChartDataEmpty && (
          <div>
            {chartTabsConfig.map((name) => (
              <Button
                key={name}
                onClick={() => setSelectedTab(name)}
                disabled={selectedTab === name}
                className="h-8 rounded-none first:rounded-l-lg last:rounded-r-lg"
              >
                {name}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!isChartDataEmpty ? (
          <ChartContainer className={cn('h-[280px] w-full', chartContainerClassName)} config={chartConfig}>
            {children}
          </ChartContainer>
        ) : (
          <DashboardComponentEmptyState message="No transaction data available" />
        )}
      </CardContent>
    </Card>
  )
}
