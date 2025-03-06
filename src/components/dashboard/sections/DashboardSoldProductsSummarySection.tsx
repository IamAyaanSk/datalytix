'use client'

import { Card, CardContent } from '@/components/ui/card'
import { IGetDashboardResponseBody } from '@/types/types'
import { TabbedChart } from '@/components/dashboard/charts/TabbedChart'
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartConfig, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useState } from 'react'
import { formattedMoney, formattedNumber, getCapitalCasedSlug } from '@/lib/utils'
import { DashboardComponentErrorState } from '@/components/dashboard/DashboardComponentErrorState'

type TDashbardSoldProductsSummarySectionProps = {
  data: Pick<
    IGetDashboardResponseBody,
    'hourlySoldProductCountAndAmountData' | 'factorytWiseManufacturedProductCountAndAmountData'
  >
}

const soldProductsSummaryChartConfig = {
  REFRIGIRATORAmount: {
    label: 'Refrigirator',
    color: 'hsl(var(--chart-1))'
  },
  TELIVISIONAmount: {
    label: 'Television',
    color: 'hsl(var(--chart-2))'
  },
  WASHING_MACHINEAmount: {
    label: 'Wasging Machine',
    color: 'hsl(var(--chart-3))'
  },
  MICROWAVEAmount: {
    label: 'Microwave',
    color: 'hsl(var(--chart-4))'
  },
  AIR_CONDITIONERAmount: {
    label: 'Air Conditioner',
    color: 'hsl(var(--chart-5))'
  },
  REFRIGIRATORCount: {
    label: 'Refrigirator',
    color: 'hsl(var(--chart-1))'
  },
  TELIVISIONCount: {
    label: 'Television',
    color: 'hsl(var(--chart-2))'
  },
  WASHING_MACHINECount: {
    label: 'Wasging Machine',
    color: 'hsl(var(--chart-3))'
  },
  MICROWAVECount: {
    label: 'Microwave',
    color: 'hsl(var(--chart-4))'
  },
  AIR_CONDITIONERCount: {
    label: 'Air Conditioner',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig

export const DashboardSoldProductsSummarySection = ({ data }: TDashbardSoldProductsSummarySectionProps) => {
  const [hourlySoldProductsSelectedChartTab, setHourlySoldProductsSelectedChartTab] = useState<'Amount' | 'Count'>(
    'Amount'
  )
  const [serviceWiseSoldProductsSelectedChartTab, setServiceWiseSoldProductsSelectedChartTab] = useState<
    'Amount' | 'Count'
  >('Amount')
  const hourlySoldProductsChartData = data.hourlySoldProductCountAndAmountData.data
  const factorytWiseManufacturedProductCountAndAmountData = data.factorytWiseManufacturedProductCountAndAmountData.data

  const hourlySoldProductsToolTipValueFormatter =
    hourlySoldProductsSelectedChartTab === 'Amount' ? formattedMoney : formattedNumber
  const serviceWiseSoldProductsToolTipValueFormatter =
    serviceWiseSoldProductsSelectedChartTab === 'Amount' ? formattedMoney : formattedNumber

  return (
    <Card className="w-full p-8 bg-muted rounded-md border-primary/30">
      <CardContent className="grid grid-cols-1 gap-5 p-0 2xl:grid-cols-5">
        {hourlySoldProductsChartData ? (
          <TabbedChart
            isChartDataEmpty={hourlySoldProductsChartData.length === 0}
            chartCardClassName="2xl:col-start-1 2xl:col-end-3"
            title={`Sold product ${hourlySoldProductsSelectedChartTab.toLowerCase()} by hour`}
            chartConfig={soldProductsSummaryChartConfig}
            chartTabsConfig={['Amount', 'Count']}
            selectedTab={hourlySoldProductsSelectedChartTab}
            setSelectedTab={setHourlySoldProductsSelectedChartTab}
          >
            <LineChart
              accessibilityLayer
              data={hourlySoldProductsChartData}
              margin={{
                left: 12,
                right: 12
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent valuesFormatter={hourlySoldProductsToolTipValueFormatter} />}
              />
              <ChartLegend className="flex-col sm:flex-row" content={<ChartLegendContent />} />

              <Line
                dataKey={`REFRIGIRATOR${hourlySoldProductsSelectedChartTab}`}
                type="monotone"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey={`TELIVISION${hourlySoldProductsSelectedChartTab}`}
                type="monotone"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey={`WASHING_MACHINE${hourlySoldProductsSelectedChartTab}`}
                type="monotone"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey={`MICROWAVE${hourlySoldProductsSelectedChartTab}`}
                type="monotone"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey={`AIR_CONDITIONER${hourlySoldProductsSelectedChartTab}`}
                type="monotone"
                stroke="hsl(var(--chart-5))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </TabbedChart>
        ) : (
          <DashboardComponentErrorState message={data.hourlySoldProductCountAndAmountData.message} />
        )}

        {factorytWiseManufacturedProductCountAndAmountData ? (
          <TabbedChart
            isChartDataEmpty={factorytWiseManufacturedProductCountAndAmountData.length === 0}
            chartCardClassName="2xl:col-start-3 2xl:col-end-6"
            title={`Sold product ${serviceWiseSoldProductsSelectedChartTab.toLowerCase()} by factory location`}
            chartConfig={soldProductsSummaryChartConfig}
            chartTabsConfig={['Amount', 'Count']}
            selectedTab={serviceWiseSoldProductsSelectedChartTab}
            setSelectedTab={setServiceWiseSoldProductsSelectedChartTab}
          >
            <BarChart
              accessibilityLayer
              layout="vertical"
              barSize={30}
              data={factorytWiseManufacturedProductCountAndAmountData}
            >
              <CartesianGrid horizontal={true} vertical={false} />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => serviceWiseSoldProductsToolTipValueFormatter(value)}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => getCapitalCasedSlug(value, '_')}
              />
              <ChartTooltip
                content={<ChartTooltipContent valuesFormatter={serviceWiseSoldProductsToolTipValueFormatter} />}
              />
              <ChartLegend className="flex-col sm:flex-row" content={<ChartLegendContent />} />
              <Bar
                dataKey={`REFRIGIRATOR${serviceWiseSoldProductsSelectedChartTab}`}
                stackId="a"
                fill="hsl(var(--chart-1))"
                radius={[4, 0, 0, 4]}
              />
              <Bar
                dataKey={`TELIVISION${serviceWiseSoldProductsSelectedChartTab}`}
                stackId="a"
                fill="hsl(var(--chart-2))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey={`WASHING_MACHINE${serviceWiseSoldProductsSelectedChartTab}`}
                stackId="a"
                fill="hsl(var(--chart-3))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey={`MICROWAVE${serviceWiseSoldProductsSelectedChartTab}`}
                stackId="a"
                fill="hsl(var(--chart-4))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey={`AIR_CONDITIONER${serviceWiseSoldProductsSelectedChartTab}`}
                stackId="a"
                fill="hsl(var(--chart-5))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </TabbedChart>
        ) : (
          <DashboardComponentErrorState message={data.factorytWiseManufacturedProductCountAndAmountData.message} />
        )}
      </CardContent>
    </Card>
  )
}
