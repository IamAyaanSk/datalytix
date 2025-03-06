import { IGetDashboardResponseBody } from '@/types/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { ClientSideDataTable } from '@/components/client-side-data-table/ClientSideDataTable'
import { recentComplaintTicketColumns } from '@/constants/data-table-columns/recentComplaintTicketsColumns'
import { DashboardComponentErrorState } from '@/components/dashboard/DashboardComponentErrorState'
import { DashboardComponentEmptyState } from '@/components/dashboard/DashboardComponentEmptyState'
import qs from 'qs'

type TDashboardOverviewSection = {
  data: Pick<
    IGetDashboardResponseBody,
    'soldProductsCountAndAmountData' | 'profitData' | 'productShippedAndManufacturedData' | 'recentComplaintTicketsData'
  >
}

const DashboardOverviewSection = async ({ data }: TDashboardOverviewSection) => {
  const soldProductsCountAndAmountData = data.soldProductsCountAndAmountData.data
  const selfProfitData = data.profitData.data
  const productShippedAndManufacturedData = data.productShippedAndManufacturedData.data
  const recentComplaintTicketsData = data.recentComplaintTicketsData.data

  return (
    <Card className="w-full p-8 rounded-sm font-sans bg-muted border border-primary/30">
      <CardContent className="flex flex-col gap-5 p-0 md:grid lg:flex xl:grid xl:grid-cols-2 xl:grid-rows-[repeat(10,1.5rem)] 2xl:grid-cols-[1fr_1fr_2fr]">
        {soldProductsCountAndAmountData ? (
          <>
            <DashboardCard
              className="row-start-1 row-end-6"
              title="Total products sold amount"
              highlightMetric={soldProductsCountAndAmountData.selectedDateData.ALL?.amount ?? 0}
              comparisonMetricConfig={{
                percentage: soldProductsCountAndAmountData.growth.soldProductsAmount.percentage,
                isNegative: soldProductsCountAndAmountData.growth.soldProductsAmount.isNegative,
                comparedTo: 'previous month',
                compareData: [
                  {
                    title: 'All Products',
                    value: soldProductsCountAndAmountData.compareDateData.AIR_CONDITIONER?.amount ?? 0,
                    color: 'green'
                  },
                  {
                    title: 'Refrigirator',
                    value: soldProductsCountAndAmountData.compareDateData.REFRIGIRATOR?.amount ?? 0,
                    color: 'red'
                  },
                  {
                    title: 'Telivision',
                    value: soldProductsCountAndAmountData.compareDateData.TELIVISION?.amount ?? 0,
                    color: 'blue'
                  },
                  {
                    title: 'Wasching Machine',
                    value: soldProductsCountAndAmountData.compareDateData.WASHING_MACHINE?.amount ?? 0,
                    color: 'purple'
                  },
                  {
                    title: 'Microwave',
                    value: soldProductsCountAndAmountData.compareDateData.MICROWAVE?.amount ?? 0,
                    color: 'yellow'
                  }
                ]
              }}
              footerConfig={{
                showSeparator: true,
                data: [
                  {
                    title: 'Refrigirator',
                    value: soldProductsCountAndAmountData.selectedDateData.REFRIGIRATOR?.amount ?? 0,
                    color: 'red'
                  },
                  {
                    title: 'Telivision',
                    value: soldProductsCountAndAmountData.selectedDateData.TELIVISION?.amount ?? 0,
                    color: 'blue'
                  },
                  {
                    title: 'Wasching Machine',
                    value: soldProductsCountAndAmountData.selectedDateData.WASHING_MACHINE?.amount ?? 0,
                    color: 'purple'
                  },
                  {
                    title: 'Microwave',
                    value: soldProductsCountAndAmountData.selectedDateData.MICROWAVE?.amount ?? 0,
                    color: 'yellow'
                  }
                ]
              }}
            />

            <DashboardCard
              isMoney={false}
              className="row-start-6 row-end-11"
              title="Total products sold count"
              highlightMetric={soldProductsCountAndAmountData.selectedDateData.ALL?.count ?? 0}
              comparisonMetricConfig={{
                percentage: soldProductsCountAndAmountData.growth.soldProductsCount.percentage,
                isNegative: soldProductsCountAndAmountData.growth.soldProductsAmount.isNegative,
                comparedTo: 'previous month',
                compareData: [
                  {
                    title: 'All Products',
                    value: soldProductsCountAndAmountData.compareDateData.AIR_CONDITIONER?.count ?? 0,
                    color: 'green'
                  },
                  {
                    title: 'Refrigirator',
                    value: soldProductsCountAndAmountData.compareDateData.REFRIGIRATOR?.count ?? 0,
                    color: 'red'
                  },
                  {
                    title: 'Telivision',
                    value: soldProductsCountAndAmountData.compareDateData.TELIVISION?.count ?? 0,
                    color: 'blue'
                  },
                  {
                    title: 'Wasching Machine',
                    value: soldProductsCountAndAmountData.compareDateData.WASHING_MACHINE?.count ?? 0,
                    color: 'purple'
                  },
                  {
                    title: 'Microwave',
                    value: soldProductsCountAndAmountData.compareDateData.MICROWAVE?.count ?? 0,
                    color: 'yellow'
                  }
                ]
              }}
              footerConfig={{
                showSeparator: true,
                data: [
                  {
                    title: 'Refrigirator',
                    value: soldProductsCountAndAmountData.selectedDateData.REFRIGIRATOR?.count ?? 0,
                    color: 'red'
                  },
                  {
                    title: 'Telivision',
                    value: soldProductsCountAndAmountData.selectedDateData.TELIVISION?.count ?? 0,
                    color: 'blue'
                  },
                  {
                    title: 'Wasching Machine',
                    value: soldProductsCountAndAmountData.selectedDateData.WASHING_MACHINE?.count ?? 0,
                    color: 'purple'
                  },
                  {
                    title: 'Microwave',
                    value: soldProductsCountAndAmountData.selectedDateData.MICROWAVE?.count ?? 0,
                    color: 'yellow'
                  }
                ]
              }}
            />
          </>
        ) : (
          <DashboardComponentErrorState
            className="row-start-1 row-end-11"
            message={data.soldProductsCountAndAmountData.message}
          />
        )}

        {selfProfitData ? (
          <DashboardCard
            className="row-start-1 row-end-5"
            title="Total profit"
            footerConfig={false}
            highlightMetric={selfProfitData.selectedDateProfit}
            comparisonMetricConfig={{
              percentage: selfProfitData.growth.percentage,
              isNegative: selfProfitData.growth.isNegative,
              comparedTo: 'previous month',
              compareData: [
                {
                  title: 'Previous Month',
                  value: selfProfitData.compareDateProfit,
                  color: 'green'
                }
              ]
            }}
          />
        ) : (
          <DashboardComponentErrorState className="row-start-1 row-end-5" message={data.profitData.message} />
        )}

        {productShippedAndManufacturedData ? (
          <>
            <DashboardCard
              className="row-start-5 row-end-8"
              title="Products manufactured"
              footerConfig={false}
              highlightMetric={productShippedAndManufacturedData.manufacturedCount}
              comparisonMetricConfig={false}
              highlightMetricColor="green"
              isMoney={false}
            />

            <DashboardCard
              className="row-start-8 row-end-11"
              title="Products shipped"
              footerConfig={false}
              highlightMetric={productShippedAndManufacturedData.shippedCount}
              comparisonMetricConfig={false}
              highlightMetricColor="blue"
              isMoney={false}
            />
          </>
        ) : (
          <DashboardComponentErrorState
            className="row-start-5 row-end-11"
            message={data.productShippedAndManufacturedData.message}
          />
        )}

        {recentComplaintTicketsData ? (
          <Card className="row-start-11 col-span-2 overflow-x-scroll py-3 2xl:row-start-1 flex flex-col 2xl:gap-4 2xl:row-end-11 2xl:col-span-1 border border-primary/30">
            <CardHeader className="py-0">
              <CardTitle className="text-lg font-medium">Recent complaint tickets</CardTitle>
            </CardHeader>
            <CardContent className="py-0 h-[75%]">
              {recentComplaintTicketsData.length > 0 ? (
                <>
                  <div className="max-h-[350px] w-full overflow-y-auto">
                    <ClientSideDataTable
                      showSearch={false}
                      columns={recentComplaintTicketColumns}
                      data={recentComplaintTicketsData}
                      showTableFooter={false}
                      columnVisibilityConfig={{
                        distributionEntity: [':ADMIN', ':OPERATION_MANAGER']
                      }}
                    />
                  </div>
                </>
              ) : (
                <DashboardComponentEmptyState
                  className="row-start-11 col-span-2"
                  message="No recent complaint tickets"
                ></DashboardComponentEmptyState>
              )}
            </CardContent>
          </Card>
        ) : (
          <DashboardComponentErrorState
            className="row-start-11 col-span-2"
            message={data.recentComplaintTicketsData.message}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default DashboardOverviewSection
