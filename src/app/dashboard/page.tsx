import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardMonthlySummarySection } from '@/components/dashboard/sections/DashboardMonthlySummarySection'
import DashboardOverviewSection from '@/components/dashboard/sections/DashboardOverviewSection'
import { DashboardSalesPersonSummarySection } from '@/components/dashboard/sections/DashboardSalesPersonSummarySection'
import { DashboardSoldProductsSummarySection } from '@/components/dashboard/sections/DashboardSoldProductsSummarySection'
import { Separator } from '@/components/ui/separator'
import { DistributionChainEntities, IGetDashboardResponseBody, UserRole } from '@/types/types'
import { Info } from 'lucide-react'
import data from '@/data/dummyDashboardData.json'
import DashboardDistributorEntitySummarySection from '@/components/dashboard/sections/DashboardDistributorEntitySummarySection'

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const distributionChainEntity = (await searchParams).entity
  const userRole = (await searchParams).role
  const isSalesHead = userRole === UserRole.SALES_HEAD
  const isAdmin = userRole === UserRole.ADMIN
  const isRetailer = distributionChainEntity === DistributionChainEntities.RETAILER

  const randomIndex = Math.floor(Math.random() * data.length)
  const dashboardReportData = data[randomIndex] as unknown as IGetDashboardResponseBody

  return (
    <section className="max-w-screen-2xl mx-auto flex max-h-fit flex-1 flex-col px-6 py-6 gap-4 lg:gap-6">
      <div className="space-y-4">
        <DashboardHeader />
      </div>

      <h2 className="text-xl font-semibold">Overview</h2>
      <DashboardOverviewSection
        data={{
          soldProductsCountAndAmountData: dashboardReportData.soldProductsCountAndAmountData,
          profitData: dashboardReportData.profitData,
          productShippedAndManufacturedData: dashboardReportData.productShippedAndManufacturedData,
          recentComplaintTicketsData: dashboardReportData.recentComplaintTicketsData
        }}
      />
      <Separator className="bg-primary/30" />

      <h2 className="text-xl font-semibold">Sold Products Summarized</h2>
      <DashboardSoldProductsSummarySection
        data={{
          hourlySoldProductCountAndAmountData: dashboardReportData.hourlySoldProductCountAndAmountData,
          factorytWiseManufacturedProductCountAndAmountData:
            dashboardReportData.factorytWiseManufacturedProductCountAndAmountData
        }}
      />
      <Separator className="bg-primary/30" />

      {(isSalesHead || isAdmin) && (
        <>
          <h2 className="text-xl font-semibold">Sales Person Summary</h2>
          <DashboardSalesPersonSummarySection
            data={{
              salesPersonSummaryData: dashboardReportData.salesPersonSummaryData
            }}
          />
          <Separator className="bg-primary/30" />
        </>
      )}

      {!isSalesHead && !isRetailer && (
        <>
          <h2 className="text-xl font-semibold">Downline Channel Summary</h2>
          <DashboardDistributorEntitySummarySection
            data={{
              distributionChainProfitData: dashboardReportData.distributionChainProfitData,
              distributionChainUnitsSoldData: dashboardReportData.distributionChainUnitsSoldData
            }}
          />

          <Separator className="bg-primary/30" />
        </>
      )}

      <h2 className="text-xl font-semibold">Monthly Summary ( Current Month )</h2>
      <DashboardMonthlySummarySection
        data={{
          averageSoldProductCountAndAmountForCurrentMonthData:
            dashboardReportData.averageSoldProductCountAndAmountForCurrentMonthData,
          dailySelfProfitData: dashboardReportData.dailySelfProfitData,
          dailySoldProductCountAndAmountData: dashboardReportData.dailySoldProductCountAndAmountData
        }}
      />
      <div className="flex flex-row gap-1 items-center bg-white p-4 rounded-md border border-primary/30">
        <Info size={15} strokeWidth={2.5} className="text-red-500" />
        <span className="text-xs font-medium text-red-500">The above reports includes 18% gst.</span>
      </div>
    </section>
  )
}
