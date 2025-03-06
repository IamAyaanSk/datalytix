'use client'

import { ClientSideDataTable } from '@/components/client-side-data-table/ClientSideDataTable'
import { Card, CardContent } from '@/components/ui/card'
import { salesPersonSummaryColumns } from '@/constants/data-table-columns/salesPersonSummaryColumns'
import { FactoryLocations, IGetDashboardResponseBody } from '@/types/types'
import { Info } from 'lucide-react'
import { DashboardComponentErrorState } from '@/components/dashboard/DashboardComponentErrorState'
import { useMemo, useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getCapitalCasedSlug } from '@/lib/utils'
import { DashboardComponentEmptyState } from '@/components/dashboard/DashboardComponentEmptyState'

type TDashboardSalesPersonSummarySectionProps = {
  data: Pick<IGetDashboardResponseBody, 'salesPersonSummaryData'>
}

export const DashboardSalesPersonSummarySection = ({ data }: TDashboardSalesPersonSummarySectionProps) => {
  const salesPersonSummaryData = data.salesPersonSummaryData.data
  const [selectedFactoryLocationOption, setSelectedFactoryLocationOption] = useState<FactoryLocations | 'all'>('all')

  const computedSalesPersonMetrics = useMemo(() => {
    if (salesPersonSummaryData) {
      let totalDistributionChainEntitiesOnboarded = 0
      let totalSoldProductsAmount = 0
      let totalSoldProductsCount = 0

      salesPersonSummaryData.forEach((salesPerson) => {
        totalDistributionChainEntitiesOnboarded += salesPerson.distributionChainEntitiesOnboarded ?? 0

        if (selectedFactoryLocationOption === 'all') {
          totalSoldProductsAmount += salesPerson.soldProductAmount ?? 0
          totalSoldProductsCount += salesPerson.soldProductCount ?? 0
        } else {
          totalSoldProductsAmount += salesPerson[`${selectedFactoryLocationOption}-Amount`] ?? 0
          totalSoldProductsCount += salesPerson[`${selectedFactoryLocationOption}-Count`] ?? 0
        }
      })

      return {
        totalDistributionChainEntitiesOnboarded,
        totalSoldProductsCount,
        totalSoldProductsAmount
      }
    }
  }, [salesPersonSummaryData, selectedFactoryLocationOption])

  const processedChartData = useMemo(() => {
    return salesPersonSummaryData?.map((data) => {
      if (selectedFactoryLocationOption === 'all') {
        return {
          name: data.name,
          distributionChainEntitiesOnboarded: data.distributionChainEntitiesOnboarded ?? 0,
          soldProductAmount: data.soldProductAmount ?? 0,
          soldProductCount: data.soldProductCount ?? 0
        }
      }

      return {
        name: data.name,
        distributionChainEntitiesOnboarded: data.distributionChainEntitiesOnboarded ?? 0,
        soldProductAmount: data[`${selectedFactoryLocationOption}-Amount`] ?? 0,
        soldProductCount: data[`${selectedFactoryLocationOption}-Count`] ?? 0
      }
    })
  }, [salesPersonSummaryData, selectedFactoryLocationOption])

  return (
    <Card className="w-full p-8 bg-muted rounded-md border-primary/30">
      <CardContent className="max-h-[550px] p-0">
        {salesPersonSummaryData ? (
          processedChartData && processedChartData?.length > 0 ? (
            <div className="space-y-3">
              <Select
                value={selectedFactoryLocationOption}
                onValueChange={(e) => setSelectedFactoryLocationOption((e as FactoryLocations) || 'all')}
              >
                <SelectTrigger className="bg-primary mb-2 ring-offset-0 rounded-md text-white font-medium w-[150px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All locations</SelectItem>
                    {Object.keys(FactoryLocations).map((factoryLocation) => (
                      <SelectItem value={factoryLocation} key={factoryLocation}>
                        {getCapitalCasedSlug(factoryLocation, '_')}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="max-h-[480px] overflow-y-auto">
                <ClientSideDataTable
                  columns={salesPersonSummaryColumns}
                  data={processedChartData}
                  initialSorting={[
                    {
                      id: 'soldProductAmount',
                      desc: true
                    }
                  ]}
                  meta={{
                    computedFooterData: {
                      totalSoldProductAmount: computedSalesPersonMetrics?.totalSoldProductsAmount,
                      totalSoldProductCount: computedSalesPersonMetrics?.totalSoldProductsCount,
                      totalDistributionChainEntitiesOnboarded:
                        computedSalesPersonMetrics?.totalDistributionChainEntitiesOnboarded
                    }
                  }}
                />
              </div>

              <div className="flex flex-row gap-2 items-center text-sm text-primary/80 border border-primary/50 font-medium bg-white p-2 rounded-md">
                <Info size={15} strokeWidth={2.5} />
                <p>{`Total ${
                  computedSalesPersonMetrics?.totalDistributionChainEntitiesOnboarded ?? 0
                } onboarding(s) done`}</p>
              </div>
            </div>
          ) : (
            <DashboardComponentEmptyState message="No sales person data to display" />
          )
        ) : (
          <DashboardComponentErrorState message={data.salesPersonSummaryData.message} />
        )}
      </CardContent>
    </Card>
  )
}
