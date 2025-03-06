'use client'

import { DistributionChainEntities, IGetDashboardResponseBody } from '@/types/types'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { getCapitalCasedSlug } from '@/lib/utils'
import { DashboardComponentErrorState } from '@/components/dashboard/DashboardComponentErrorState'
import { DISTRIBUTION_ENTITY_TYPE_TO_LEVEL_MAP } from '@/constants/global'
import { useSearchParams } from 'next/navigation'

type TDashboardDistributorEntitySummarySection = {
  data: Pick<IGetDashboardResponseBody, 'distributionChainProfitData' | 'distributionChainUnitsSoldData'>
}

const DashboardDistributorEntitySummarySection = ({ data }: TDashboardDistributorEntitySummarySection) => {
  const distributionChainProfitData = data.distributionChainProfitData.data
  const distributionChainUnitsSoldData = data.distributionChainUnitsSoldData.data

  const searchParams = useSearchParams()
  const selectedUserEntity = searchParams.get('entity')

  const possibleEntities = Object.keys(DISTRIBUTION_ENTITY_TYPE_TO_LEVEL_MAP)
    .map((key) => {
      if (
        DISTRIBUTION_ENTITY_TYPE_TO_LEVEL_MAP[key as DistributionChainEntities] >
        DISTRIBUTION_ENTITY_TYPE_TO_LEVEL_MAP[
          (selectedUserEntity as DistributionChainEntities) ?? DistributionChainEntities.RETAILER
        ]
      ) {
        return key as DistributionChainEntities
      }
    })
    .filter((entity) => !!entity)

  return (
    <Card className="w-full p-8 bg-muted rounded-md font-sans border-primary/30">
      <CardContent className="flex flex-row gap-5 flex-wrap p-0">
        {distributionChainProfitData && distributionChainUnitsSoldData ? (
          <>
            {possibleEntities.map((distributionEntity) => {
              const currentDistributorEntityProfitData =
                distributionChainProfitData?.[distributionEntity as DistributionChainEntities]
              const currentDistributorEntityUnitSoldData =
                distributionChainUnitsSoldData?.[distributionEntity as DistributionChainEntities]

              return (
                <DashboardCard
                  title={getCapitalCasedSlug(distributionEntity, '_')}
                  key={distributionEntity}
                  highlightMetric={currentDistributorEntityProfitData?.selectedDateProfit ?? 0}
                  comparisonMetricConfig={{
                    percentage: currentDistributorEntityProfitData?.growth.percentage ?? null,
                    isNegative: currentDistributorEntityProfitData?.growth.isNegative ?? null,
                    comparedTo: 'previous month',
                    compareData: [
                      {
                        title: 'Profit',
                        value: currentDistributorEntityProfitData?.compareDateProfit ?? 0,
                        color: 'green'
                      }
                    ]
                  }}
                  footerConfig={{
                    showSeparator: true,
                    className: 'grid-cols-1',
                    data: [
                      {
                        title: 'Total sales amount',
                        value: currentDistributorEntityUnitSoldData?.amount ?? 0,
                        color: 'green'
                      },
                      {
                        title: 'Total units sold',
                        value: currentDistributorEntityUnitSoldData?.count ?? 0,
                        color: 'blue'
                      }
                    ]
                  }}
                />
              )
            })}
          </>
        ) : (
          <DashboardComponentErrorState
            message={
              data.distributionChainProfitData.status === 'error'
                ? data.distributionChainProfitData.message
                : data.distributionChainUnitsSoldData.message
            }
          />
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardDistributorEntitySummarySection
