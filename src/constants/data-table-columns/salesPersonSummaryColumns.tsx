'use client'

import { formattedMoney, formattedNumber } from '@/lib/utils'
import { IGetDashboardResponseBody } from '@/types/types'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

const salesPersonSummaryColumnHelper =
  createColumnHelper<NonNullable<IGetDashboardResponseBody['salesPersonSummaryData']['data']>[number]>()

export const salesPersonSummaryColumns = [
  salesPersonSummaryColumnHelper.accessor('name', {
    header: 'Name',
    cell: ({ row }) => {
      const name = row.original.name

      return <p>{name}</p>
    },
    enableSorting: false
  }),

  salesPersonSummaryColumnHelper.accessor('soldProductAmount', {
    header: 'Channel Sales Amount',
    cell: ({ row }) => {
      const soldProductAmount = row.original.soldProductAmount ?? 0

      return <p>{formattedMoney(soldProductAmount)}</p>
    },
    footer: ({ table }) => {
      const total = table.options.meta?.computedFooterData?.totalSoldProductAmount ?? 0
      return <p>{formattedMoney(total)}</p>
    }
  }),

  salesPersonSummaryColumnHelper.accessor('soldProductCount', {
    header: 'Channel Sales Count',
    cell: ({ row }) => {
      const soldProductCount = row.original.soldProductCount ?? 0

      return <p>{formattedNumber(soldProductCount)}</p>
    },
    footer: ({ table }) => {
      const total = table.options.meta?.computedFooterData?.totalSoldProductCount ?? 0
      return <p>{formattedNumber(total)}</p>
    }
  }),

  salesPersonSummaryColumnHelper.accessor('distributionChainEntitiesOnboarded', {
    header: 'Distruibution Chain Entities Onboarded',
    cell: ({ row }) => {
      const distributionChainEntitiesOnboarded = row.original.distributionChainEntitiesOnboarded

      return <p>{formattedNumber(distributionChainEntitiesOnboarded ?? 0)}</p>
    },
    footer: ({ table }) => {
      const total = table.options.meta?.computedFooterData?.totalDistributionChainEntitiesOnboarded ?? 0
      return <p>{formattedNumber(total)}</p>
    }
  })
] as ColumnDef<NonNullable<IGetDashboardResponseBody['salesPersonSummaryData']['data']>[number]>[]
