export enum ComplaintTicketsStatus {
  RESOLVED = 'RESOLVED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING'
}

export enum Products {
  REFRIGIRATOR = 'REFRIGIRATOR',
  WASHING_MACHINE = 'WASHING_MACHINE',
  TELIVISION = 'TELIVISION',
  AIR_CONDITIONER = 'AIR_CONDITIONER',
  MICROWAVE = 'MICROWAVE'
}

export enum DistributionChainEntities {
  ADMIN = 'ADMIN',
  DISTRIBUTOR = 'DISTRIBUTOR',
  WHOLESELLER = 'WHOLESELLER',
  RETAILER = 'RETAILER'
}

export enum FactoryLocations {
  DELHI = 'DELHI',
  GUJARAT = 'GUJARAT',
  KERELA = 'KERELA',
  KASHMIR = 'KASHMIR'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES_HEAD = 'SALES_HEAD',
  OPERATION_MANAGER = 'OPERATION_MANAGER'
}

export type TAuthorizationPermissionSatifactionCombination =
  | `${DistributionChainEntities}:${UserRole}`
  | `${DistributionChainEntities}:`
  | `:${UserRole}`

export type TProductMetricsForDashboardCharts = {
  [Product in Products as `${Product}${'Count' | 'Amount'}`]: number
}

export type TDashboardPercentageGrowth = {
  percentage: number | null
  isNegative: boolean | null
}

export type TFactoryLocationWiseProductMetricsForDashboard = {
  [FactoryLocation in FactoryLocations as `${FactoryLocation}${'-Count' | '-Amount'}`]?: number
}

export interface IGetDashboardResponseBody {
  soldProductsCountAndAmountData: {
    status: 'success' | 'error'
    data?: {
      selectedDateData: Partial<
        Record<Products, { count: number; amount: number }> & {
          ALL: { count: number; amount: number }
        }
      >
      compareDateData: Partial<
        Record<
          Products,
          { count: number; amount: number } & {
            ALL: { count: number; amount: number }
          }
        >
      >
      growth: {
        soldProductsCount: TDashboardPercentageGrowth
        soldProductsAmount: TDashboardPercentageGrowth
      }
    }
    message?: string
  }

  profitData: {
    status: 'success' | 'error'
    message?: string
    data?: {
      selectedDateProfit: number
      compareDateProfit: number
      growth: TDashboardPercentageGrowth
    }
  }

  distributionChainProfitData: {
    status: 'success' | 'error'
    message?: string
    data?: Partial<
      Record<
        DistributionChainEntities,
        {
          selectedDateProfit: number
          compareDateProfit: number
          growth: TDashboardPercentageGrowth
        }
      >
    >
  }

  recentComplaintTicketsData: {
    status: 'success' | 'error'
    message?: string
    data?: {
      title: string
      status: ComplaintTicketsStatus
      description: string
      customer: {
        name: string
        email: string
      }
      createdAt: string
    }[]
  }

  productShippedAndManufacturedData: {
    status: 'success' | 'error'
    message?: string
    data?: {
      manufacturedCount: number
      shippedCount: number
    }
  }

  distributionChainUnitsSoldData: {
    status: 'success' | 'error'
    message?: string
    data?: Partial<
      Record<
        DistributionChainEntities,
        {
          count: number
          amount: number
        }
      >
    >
  }

  factorytWiseManufacturedProductCountAndAmountData: {
    status: 'success' | 'error'
    message?: string
    data?: (TProductMetricsForDashboardCharts & {
      name: FactoryLocations
    })[]
  }

  salesPersonSummaryData: {
    status: 'success' | 'error'
    message?: string
    data?: ({
      name: string
      soldProductCount?: number
      soldProductAmount?: number
      distributionChainEntitiesOnboarded?: number
    } & TFactoryLocationWiseProductMetricsForDashboard)[]
  }

  hourlySoldProductCountAndAmountData: {
    status: 'success' | 'error'
    message?: string
    data?: (TProductMetricsForDashboardCharts & {
      hour: string
    })[]
  }

  dailySoldProductCountAndAmountData: {
    status: 'success' | 'error'
    message?: string
    data?: {
      day: string
      currentMonthCount: number
      previousMonthCount: number
      currentMonthAmount: number
      previousMonthAmount: number
    }[]
  }

  dailySelfProfitData: {
    status: 'success' | 'error'
    message?: string
    data?: {
      day: string
      currentMonthProfit: number
      previousMonthProfit: number
    }[]
  }

  averageSoldProductCountAndAmountForCurrentMonthData: {
    status: 'success' | 'error'
    message?: string
    data?: {
      averageCount: number
      averageAmount: number
    }
  }
}
