'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IGetDashboardResponseBody } from '@/types/types'
import { TabbedChart } from '@/components/dashboard/charts/TabbedChart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { useState } from 'react'
import { formattedMoney, formattedNumber } from '@/lib/utils'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { DashboardComponentErrorState } from '@/components/dashboard/DashboardComponentErrorState'
import { DashboardComponentEmptyState } from '@/components/dashboard/DashboardComponentEmptyState'

type TDashboardMonthlySummarySectionProps = {
  data: Pick<
    IGetDashboardResponseBody,
    'averageSoldProductCountAndAmountForCurrentMonthData' | 'dailySoldProductCountAndAmountData' | 'dailySelfProfitData'
  >
}

const dailySoldProductCountAndAmountChartConfig = {
  currentMonthAmount: {
    label: 'This Month',
    color: 'hsl(var(--chart-1))'
  },
  previousMonthAmount: {
    label: 'Last Month',
    color: 'hsl(var(--chart-5))'
  },
  currentMonthCount: {
    label: 'This Month',
    color: 'hsl(var(--chart-1))'
  },
  previousMonthCount: {
    label: 'Last Month',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

const dailySelfProfitChartConfig = {
  currentMonthProfit: {
    label: 'This Month',
    color: 'hsl(var(--chart-1))'
  },
  previousMonthProfit: {
    label: 'Last Month',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export const DashboardMonthlySummarySection = ({ data }: TDashboardMonthlySummarySectionProps) => {
  const [dailySoldProductsSelectedChartTab, setDailySoldProductsSelectedChartTab] = useState<'Amount' | 'Count'>(
    'Amount'
  )

  const dailySoldProductCountAndAmountData = data.dailySoldProductCountAndAmountData.data
  const dailySelfProfitData = data.dailySelfProfitData.data
  const averageSoldProductCountAndAmountForCurrentMonthData =
    data.averageSoldProductCountAndAmountForCurrentMonthData.data

  const dailySoldProductsToolTipValueFormatter =
    dailySoldProductsSelectedChartTab === 'Amount' ? formattedMoney : formattedNumber

  return (
    <Card className="w-full p-8 bg-muted rounded-md border-primary/30">
      <CardContent className="flex flex-col gap-5 p-0">
        {averageSoldProductCountAndAmountForCurrentMonthData ? (
          <div className="flex flex-row gap-5 flex-wrap">
            <DashboardCard
              className="row-start-1 row-end-5"
              title="Average daily product sales amount"
              footerConfig={false}
              highlightMetric={averageSoldProductCountAndAmountForCurrentMonthData.averageAmount}
              comparisonMetricConfig={false}
            />
            <DashboardCard
              className="row-start-1 row-end-5"
              title="Average daily product sales count"
              footerConfig={false}
              highlightMetric={averageSoldProductCountAndAmountForCurrentMonthData.averageCount}
              isMoney={false}
              comparisonMetricConfig={false}
            />
          </div>
        ) : (
          <DashboardComponentErrorState message={data.averageSoldProductCountAndAmountForCurrentMonthData.message} />
        )}

        {dailySoldProductCountAndAmountData ? (
          <TabbedChart
            isChartDataEmpty={dailySoldProductCountAndAmountData.length === 0}
            chartCardClassName="2xl:col-start-1 2xl:col-end-3"
            title={`Sold products ${dailySoldProductsSelectedChartTab.toLowerCase()} this month`}
            chartConfig={dailySoldProductCountAndAmountChartConfig}
            chartTabsConfig={['Amount', 'Count']}
            selectedTab={dailySoldProductsSelectedChartTab}
            setSelectedTab={setDailySoldProductsSelectedChartTab}
          >
            <BarChart accessibilityLayer data={dailySoldProductCountAndAmountData} maxBarSize={25}>
              <CartesianGrid horizontal={true} vertical={false} />

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="day"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                content={<ChartTooltipContent valuesFormatter={dailySoldProductsToolTipValueFormatter} />}
              />
              <ChartLegend className="flex-col sm:flex-row" content={<ChartLegendContent />} />
              <Bar dataKey={`currentMonth${dailySoldProductsSelectedChartTab}`} fill="hsl(var(--chart-1))" radius={4} />
              <Bar
                dataKey={`previousMonth${dailySoldProductsSelectedChartTab}`}
                fill="hsl(var(--chart-5))"
                radius={4}
              />
            </BarChart>
          </TabbedChart>
        ) : (
          <DashboardComponentErrorState message={data.dailySoldProductCountAndAmountData.message} />
        )}

        {dailySelfProfitData ? (
          <Card className="border border-primary/30">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-lg font-medium">Profit earned this month</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {dailySelfProfitData.length > 0 ? (
                <ChartContainer className="h-[280px] w-full" config={dailySelfProfitChartConfig}>
                  <BarChart accessibilityLayer data={dailySelfProfitData} maxBarSize={25}>
                    <CartesianGrid horizontal={true} vertical={false} />

                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent valuesFormatter={formattedMoney} />} />
                    <ChartLegend className="flex-col sm:flex-row" content={<ChartLegendContent />} />
                    <Bar dataKey="currentMonthProfit" fill="hsl(var(--chart-1))" radius={4} />
                    <Bar dataKey="previousMonthProfit" fill="hsl(var(--chart-5))" radius={4} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <DashboardComponentEmptyState message="No profit data available" />
              )}
            </CardContent>
          </Card>
        ) : (
          <DashboardComponentErrorState message={data.dailySelfProfitData.message} />
        )}
      </CardContent>
    </Card>
  )
}
